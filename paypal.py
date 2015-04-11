import paypalrestsdk
import logging 
paypalrestsdk.configure({
  "mode": "sandbox", # sandbox or live
  "client_id": "Ac0V2MLPF7brDffSLgf8BnKVSRtuv0XnyfrQt1lIOuYbG9Zt1_AU0t3-u0v3QBNEFmfsHwn1QBfTejwH",
  "client_secret": "EPF_K2Gm8yfnylElN5XWsp6d-FufdHIzB5sGoS_X81tKp16s60-7Dl4wOXdcE0niKQe8MsSbirCKKczF" }x)

logging.basicConfig(level=logging.INFO)

payment = paypalrestsdk.Payment({
  "intent": "sale",
  "payer": {
    "payment_method": "credit_card",
    "funding_instruments": [{
      "credit_card": {
        "type": "visa",
        "number": "4417119669820331",
        "expire_month": "11",
        "expire_year": "2018",
        "cvv2": "874",
        "first_name": "Joe",
        "last_name": "Shopper" }}]},
  "transactions": [{
    "item_list": {
      "items": [{
        "name": "item",
        "sku": "item",
        "price": "1.00",
        "currency": "USD",
        "quantity": 1 }]},
    "amount": {
      "total": "1.00",
      "currency": "USD" },
    "description": "This is the payment transaction description." }]})

if payment.create():
  print("Payment created successfully")
else:
  print(payment.error)