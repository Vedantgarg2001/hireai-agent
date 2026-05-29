import os, json, logging, re
from typing import Any

logger = logging.getLogger(__name__)

def get_llm_response(system_prompt: str, user_prompt: str, fallback: Any) -> Any:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()

    if not api_key or api_key == "your-openai-key-here":
        print("❌ No API key found — using fallback")
        return fallback

    print(f"🔑 API key found: {api_key[:12]}... trying Groq...")

    try:
        from openai import OpenAI
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
        )
        print("📡 Sending request to Groq...")
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=4000,
        )
        raw = response.choices[0].message.content.strip()
        print(f"✅ Groq responded! Raw length: {len(raw)} chars")
        print(f"📄 First 200 chars: {raw[:200]}")

        # Try to extract JSON from the response
        # Method 1: strip markdown fences
        if "```" in raw:
            parts = raw.split("```")
            for part in parts:
                part = part.strip()
                if part.startswith("json"):
                    part = part[4:].strip()
                if part.startswith("{") or part.startswith("["):
                    raw = part
                    break

        # Method 2: find JSON object in the text
        if not raw.startswith("{") and not raw.startswith("["):
            match = re.search(r'\{.*\}', raw, re.DOTALL)
            if match:
                raw = match.group()

        raw = raw.strip()
        print(f"📄 Cleaned JSON first 100 chars: {raw[:100]}")

        result = json.loads(raw)
        print("✅ JSON parsed successfully!")
        return result

    except json.JSONDecodeError as e:
        print(f"❌ JSON parse failed: {e}")
        print(f"📄 Raw response was: {raw[:500] if 'raw' in dir() else 'N/A'}")
        return fallback
    except Exception as e:
        print(f"❌ LLM call failed: {type(e).__name__}: {e}")
        return fallback