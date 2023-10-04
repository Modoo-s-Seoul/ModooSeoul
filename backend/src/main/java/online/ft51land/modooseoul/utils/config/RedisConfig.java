package online.ft51land.modooseoul.utils.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Getter
@Configuration
@RequiredArgsConstructor
@EnableRedisRepositories // Redis Repository 활성화
@EnableTransactionManagement
public class RedisConfig {


    @Value("${spring.cache.redis.host}")
    private String redis_host;

    @Value("${spring.cache.redis.port}")
    private int redis_port;
    @Value("${spring.cache.redis.password}")
    private String redis_password;
    /**
     * 내장 혹은 외부의 Redis를 연결
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(redis_host);
        redisStandaloneConfiguration.setPort(redis_port);
        redisStandaloneConfiguration.setPassword(RedisPassword.of(redis_password));
        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }

    /**
     * RedisConnection에서 넘겨준 byte 값 객체 직렬화
     */
    @Bean
    public RedisTemplate<?,?> redisTemplate(){
        RedisTemplate<byte[], byte[]> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setEnableTransactionSupport(true); // redis Transaction 설정 On!
        return redisTemplate;
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        return new JpaTransactionManager();
    }
}
