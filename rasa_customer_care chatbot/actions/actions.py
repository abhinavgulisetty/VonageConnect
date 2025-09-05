from typing import Any, Dict, List, Text

from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict


def normalize_order_number(raw: Text) -> Text:
    if raw is None:
        return None
    cleaned = raw.strip()
    if cleaned.startswith("#"):
        cleaned = cleaned[1:]
    return cleaned


class ActionCheckOrderStatus(Action):
    def name(self) -> Text:
        return "action_check_order_status"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> List[Dict[Text, Any]]:
        order_number = tracker.get_slot("order_number")
        order_number = normalize_order_number(order_number)

        if not order_number or not order_number.isdigit():
            dispatcher.utter_message(text="I couldn't read a valid order number. Please send like #12345.")
            return []

        mock_status_map: Dict[Text, Text] = {
            "12345": "📦 Out for delivery - Expected delivery today by 6 PM",
            "98765": "🚛 Shipped - Tracking: 1Z999AA1234567890. In transit, expected delivery in 2-3 business days",
            "55555": "⚙️ Processing - Your order is being prepared for shipment",
            "54321": "✅ Delivered - Package was left at your front door on Dec 4, 2024 at 2:30 PM",
            "77777": "📍 In transit - Currently at sorting facility in Chicago, IL",
            "11111": "🔄 Order confirmed - Payment processed, preparing to ship",
            "22222": "🚚 Out for delivery - Driver will arrive between 10 AM - 2 PM today",
            "33333": "⏳ Delayed - Weather conditions causing 1-2 day delay, sorry for inconvenience",
            "44444": "📋 Ready for pickup - Available at local pickup location",
            "99999": "❌ Order not found - Please check your order number",
            "88888": "🔍 Investigating - There seems to be an issue, our team is looking into it",
            "67890": "✅ Delivered - Signed for by J. Smith on Dec 3, 2024",
            "87654": "🚢 International shipping - Package cleared customs, now in local delivery network"
        }

        status = mock_status_map.get(order_number, "⚙️ Processing - We'll update you as soon as we have more information")
        if order_number in mock_status_map:
            dispatcher.utter_message(text=f"Status for order #{order_number}: {status}")
        else:
            dispatcher.utter_message(text=f"Status for order #{order_number}: {status}\n\n💡 For demo purposes, try these order numbers: #12345, #98765, #55555, #54321, #77777")
        return [SlotSet("order_number", order_number)]
