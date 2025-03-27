source .env

# curl --silent https://$DOMAIN/ollama/api/tags | jq

PROMPT=$1
curl  --silent \
-H "Content-Type: application/json" \
-H "Authorization: Bearer ollama" \
-d "{
        \"model\": \"gemma:2b\",
        \"temperature\": 0.7,
        \"messages\": [
          {\"role\": \"user\", \"content\": \"$PROMPT\"}
        ],
        \"stream\": false
}" \
"https://$DOMAIN/ollama/v1/chat/completions" | jq