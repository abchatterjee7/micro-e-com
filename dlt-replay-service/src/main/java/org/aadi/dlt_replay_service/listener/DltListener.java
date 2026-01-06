package org.aadi.dlt_replay_service.listener;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class DltListener {

    @KafkaListener(topics = {
            "order.created.dlt",
            "payment.failed.dlt",
            "payment.completed.dlt",
            "notification.dlt"
    }, groupId = "dlt-replay-admin")
    public void consume(ConsumerRecord<String, String> record) {

        System.out.println("DLT message received:");
        System.out.println(record.value());

        // Replay is MANUAL via API, not automatic
    }
}
