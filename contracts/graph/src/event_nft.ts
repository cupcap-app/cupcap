import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  EventCreated,
  Participated,
  Attended,
} from "../generated/EventNFT/EventNFT";
import { Event, Participant } from "../generated/schema";

const STATUS_PARTICIPATED = "participated";
const STATUS_ATTENDED = "attended";

function getEventEntity(eventIDNumber: BigInt): Event {
  const id = eventIDNumber.toHex();

  const event = Event.load(id);
  if (event) {
    return event;
  }

  return new Event(id);
}

function getParticipantEntity(eventID: BigInt, address: Address): Participant {
  const id = `${eventID.toHex()}_${address.toHex()}`;

  const participant = Participant.load(id);
  if (participant) {
    return participant;
  }

  return new Participant(id);
}

export function handleEventCreated(e: EventCreated): void {
  const event = getEventEntity(e.params.eventID);

  event.createdBy = e.params.createdBy;
  event.startedAt = e.params.startedAt;
  event.endedAt = e.params.endedAt;
  event.limitOfParticipants = e.params.limitOfParticipants;
  event.participantType = e.params.participantType;
  event.targetTokenAddress = e.params.targetTokenAddress;
  event.targetTokenID = e.params.targetTokenID;

  event.save();
}

export function handleParticipated(e: Participated): void {
  // Update Event
  const event = getEventEntity(e.params.eventID);
  event.numberOfParticipants = e.params.numberOfParticipants;
  event.numberOfAttendance = e.params.numberOfAttendance;

  event.save();

  // Create Participant
  const participant = getParticipantEntity(
    e.params.eventID,
    e.params.participant
  );
  participant.eventID = e.params.eventID;
  participant.account = e.params.participant;
  participant.status = STATUS_PARTICIPATED;

  participant.save();
}

export function handleAttended(e: Attended): void {
  // Update Event
  const event = getEventEntity(e.params.eventID);
  event.numberOfParticipants = e.params.numberOfParticipants;
  event.numberOfAttendance = e.params.numberOfAttendance;

  event.save();

  const participant = getParticipantEntity(
    e.params.eventID,
    e.params.participant
  );
  participant.status = STATUS_ATTENDED;
  participant.poapID = e.params.poapID;

  participant.save();
}
