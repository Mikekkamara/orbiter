export default {};

declare global {
  interface MessageInfo {
    city: string;
    created_at: number;
    id: number;
    img: string;
    name: string;
    position: string;
    _orbits_last_message: {
      message: string;
      message_head: string;
    };
  }
  interface Message {
    array: MessageInfo[];
    contact_date: string;
  }
}
