package online.ft51land.modooseoul.domain.room.repository;


import online.ft51land.modooseoul.domain.room.entity.Room;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.repository.CrudRepository;

public interface RoomRepository extends CrudRepository<Room, String> {
}
