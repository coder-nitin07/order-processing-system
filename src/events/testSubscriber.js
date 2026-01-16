import { redisSubscriber } from "../config/redis.js";
import { redisPublisher } from "../config/redis.js";



await redisSubscriber.subscribe("TEST_EVENT", (message) => {
  console.log("Received TEST_EVENT:", message);
});

await redisPublisher.publish(
  "TEST_EVENT",
  JSON.stringify({ msg: "Hello Events" })
);




