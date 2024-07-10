import { Notification } from "../models/notification.model.js";
import amqplib from "amqplib";

const rabbitMQUrl = "amqp://localhost:15672";
const queue = "notifications";

const notificationpost = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const connection = await amqplib.connect(rabbitMQUrl);
    if (!connection) {
      res.status(400).json("cannot create connection");
    }
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ userId, message, read: false }))
    );
    console.log(" [x] Sent '%s'", message);
    await channel.close();
    await connection.close();

    res.status(200).json({ success: "Notification sent successfully" });
  } catch (error) {
    res.status(500).json(`Error in generating notification ${error}`);
  }
};

const getnotifications = async (req, res) => {
  try {
    const notifdb = await Notification.findById({ userId: req.user.userId });
    // console.log(req.user);
    //console.log(req.user.userId)
    if (!notifdb) {
      res.status(400).json("Error in notifdb...line 30-40");
    }
    res.status(200).json({ success: "Successfully got notification" });
  } catch (error) {
    res.status(500).json(`Error in getting posts ${error}`);
  }
};

const getnotificationsbyId = async (req, res) => {
  try {
    const notifdbparam = await Notification.findById(req.params.id);

    if (!notifdbparam) {
      res.status(400).json("Error in notifdb...line 30-40");
    }
    res.status(200).json({ success: "Successfully got notification" });
  } catch (error) {
    res.status(500).json(`Error in getting posts ${error}`);
  }
};

export { notificationpost, getnotifications, getnotificationsbyId };
