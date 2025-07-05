# Create a promotion
curl -X POST http://localhost:8000/api/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "promotionName": "Adi Melamed",                    
    "userGroupName": "Premium Users",    
    "type": "basic",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-08-31T23:59:59.000Z"
  }'

# Update a promotion
curl -X PUT http://localhost:8000/api/promotions/686598ab821e396e22c8 \
  -H "Content-Type: application/json" \
  -d '{
    "promotionName": "Adi Melamed",                    
    "userGroupName": "Premium Users",    
    "type": "basic",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-08-31T23:59:59.000Z"
  }'

# Get all promotions
curl -X GET http://localhost:8000/api/promotions?page=1&limit=10

# Delete a promotion
curl -X DELETE http://localhost:8000/api/promotions/686585ae7a0d35b0573979d2