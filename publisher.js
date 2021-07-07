const amqp = require("amqplib");
exports.createMessageQueue = async function (messages, queueName) {
  try {
    const connection = await amqp.connect(queueName);
    const channel = await connection.createChannel();
    const result = await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messages)));
  } catch (error) {
    console.log(error);
  }
};

exports.receiveQueue = async function () {
  try {
    const connection = await amqp.connect(process.env.RABBIT_CONNECTION);
    const channel = await connection.createChannel();
    const assert = await channel.assertQueue(process.env.QUEUE_NAME);
    channel.consume(process.env.QUEUE_NAME, (result) => {
      console.log("received result : ", result.content.toString());

      channel.ack(result);
    });
  } catch (error) {
    console.log(error);
  }
};
