from flask import Flask, render_template, request, jsonify  # type: ignore[reportMissingImports]
from PIL import Image  # type: ignore[reportMissingImports]
import torch  # type: ignore[reportMissingImports]
try:
    from transformers import CLIPProcessor, CLIPModel  # type: ignore[reportMissingImports]
except ImportError as exc:
    raise RuntimeError(
        "The 'transformers' package is required. Install it with: pip install transformers"
    ) from exc
from datetime import datetime
import os

app = Flask(__name__)

# =========================================================
# AI MODEL
# =========================================================

MODEL_NAME = "openai/clip-vit-base-patch32"

print("Loading Kabadi Setu AI model...")

device = "cuda" if torch.cuda.is_available() else "cpu"

processor = CLIPProcessor.from_pretrained(MODEL_NAME)
model = CLIPModel.from_pretrained(MODEL_NAME)

model = model.to(device)
model.eval()

print("AI model loaded successfully.")
print("Kabadi Setu is ready.")


# =========================================================
# MATERIAL DATABASE
# =========================================================

MATERIALS = {

    "Iron": {
        "rate": 35,
        "range": "₹30–₹40/kg",
        "type": "General Recyclable",
        "prompts": [
            "scrap iron metal",
            "iron scrap",
            "old iron material",
            "iron rods and scrap",
            "rusty iron waste"
        ]
    },

    "Steel": {
        "rate": 45,
        "range": "₹40–₹50/kg",
        "type": "General Recyclable",
        "prompts": [
            "stainless steel scrap",
            "steel scrap",
            "old steel material",
            "steel utensils",
            "steel waste"
        ]
    },

    "Aluminium": {
        "rate": 140,
        "range": "₹120–₹160/kg",
        "type": "General Recyclable",
        "prompts": [
            "aluminium scrap",
            "aluminum metal waste",
            "old aluminium material",
            "aluminium cans",
            "aluminium scrap metal"
        ]
    },

    "Copper": {
        "rate": 700,
        "range": "₹650–₹750/kg",
        "type": "General Recyclable",
        "prompts": [
            "copper scrap",
            "copper wire",
            "copper metal",
            "old copper cables",
            "copper electrical wire"
        ]
    },

    "Plastic": {
        "rate": 25,
        "range": "₹20–₹30/kg",
        "type": "General Recyclable",
        "prompts": [
            "plastic waste",
            "plastic scrap",
            "plastic bottles",
            "recyclable plastic",
            "plastic material"
        ]
    },

    "Glass": {
        "rate": 15,
        "range": "₹10–₹20/kg",
        "type": "General Recyclable",
        "prompts": [
            "glass waste",
            "glass bottles",
            "glass scrap",
            "recyclable glass",
            "broken glass"
        ]
    },

    "Books & Newspapers": {
        "rate": 28,
        "range": "₹25–₹32/kg",
        "type": "Paper",
        "prompts": [
            "old books and newspapers",
            "paper waste",
            "newspaper scrap",
            "old books",
            "recyclable paper"
        ]
    },

    "Printed Circuit Board": {
        "rate": 220,
        "range": "₹200–₹240/kg",
        "type": "E-Waste",
        "prompts": [
            "printed circuit board",
            "electronic circuit board",
            "PCB electronic waste",
            "computer motherboard",
            "green circuit board"
        ]
    },

    "Copper Cable": {
        "rate": 380,
        "range": "₹350–₹420/kg",
        "type": "E-Waste",
        "prompts": [
            "copper electrical cable",
            "electronic copper wire",
            "electrical wires",
            "copper cable scrap",
            "old electrical cable"
        ]
    },

    "Lithium Battery": {
        "rate": 105,
        "range": "₹90–₹120/kg",
        "type": "E-Waste",
        "prompts": [
            "lithium ion battery",
            "rechargeable battery",
            "lithium battery",
            "electronic battery",
            "battery waste"
        ]
    },

    "Mobile Phone": {
        "rate": 3500,
        "range": "₹3000–₹4000/kg",
        "type": "E-Waste",
        "prompts": [
            "old mobile phone",
            "smartphone electronic waste",
            "discarded mobile phone",
            "used smartphone",
            "mobile phone scrap"
        ]
    },

    "Laptop": {
        "rate": 280,
        "range": "₹250–₹320/kg",
        "type": "E-Waste",
        "prompts": [
            "old laptop",
            "laptop electronic waste",
            "computer laptop scrap",
            "discarded laptop",
            "used laptop"
        ]
    },

    "Display/LCD": {
        "rate": 180,
        "range": "₹150–₹220/kg",
        "type": "E-Waste",
        "prompts": [
            "LCD display",
            "computer monitor",
            "broken LCD screen",
            "electronic display waste",
            "old monitor"
        ]
    },

    "Electric Motor": {
        "rate": 300,
        "range": "₹250–₹350/kg",
        "type": "E-Waste",
        "prompts": [
            "electric motor",
            "old electric motor",
            "motor scrap",
            "electrical motor waste",
            "copper motor"
        ]
    },

    "Mixed E-Waste": {
        "rate": 120,
        "range": "₹100–₹140/kg",
        "type": "E-Waste",
        "prompts": [
            "mixed electronic waste",
            "mixed e-waste",
            "electronic scrap",
            "old electronics",
            "electronic waste"
        ]
    },

    "Mixed / Other Waste": {
        "rate": 0,
        "range": "Not available",
        "type": "Other",
        "prompts": [
            "mixed waste",
            "other recyclable waste",
            "unknown waste",
            "miscellaneous waste",
            "unidentified material"
        ]
    }
}


# =========================================================
# RECYCLER DATABASE
# =========================================================

RECYCLERS = [

    {
        "name": "GreenCycle Recycling Pvt. Ltd.",
        "distance": "4.2 km",
        "rating": 4.8,
        "authorization": "Verified",
        "pickup": True,
        "rates": {
            "Printed Circuit Board": 240,
            "Copper Cable": 420,
            "Lithium Battery": 110,
            "Mobile Phone": 3600,
            "Laptop": 290,
            "Display/LCD": 190,
            "Electric Motor": 310,
            "Mixed E-Waste": 125,
            "Copper": 760,
            "Aluminium": 150,
            "Iron": 36,
            "Steel": 46,
            "Plastic": 26,
            "Glass": 16,
            "Books & Newspapers": 29
        }
    },

    {
        "name": "EcoLoop Recycling",
        "distance": "7.8 km",
        "rating": 4.6,
        "authorization": "Verified",
        "pickup": True,
        "rates": {
            "Printed Circuit Board": 230,
            "Copper Cable": 410,
            "Lithium Battery": 105,
            "Mobile Phone": 3500,
            "Laptop": 295,
            "Display/LCD": 185,
            "Electric Motor": 300,
            "Mixed E-Waste": 120,
            "Copper": 750,
            "Aluminium": 140,
            "Iron": 35,
            "Steel": 45,
            "Plastic": 25,
            "Glass": 15,
            "Books & Newspapers": 28
        }
    },

    {
        "name": "ReNew Materials",
        "distance": "11.5 km",
        "rating": 4.5,
        "authorization": "Verified",
        "pickup": False,
        "rates": {
            "Printed Circuit Board": 225,
            "Copper Cable": 400,
            "Lithium Battery": 115,
            "Mobile Phone": 3700,
            "Laptop": 300,
            "Display/LCD": 200,
            "Electric Motor": 320,
            "Mixed E-Waste": 118,
            "Copper": 730,
            "Aluminium": 150,
            "Iron": 34,
            "Steel": 44,
            "Plastic": 24,
            "Glass": 14,
            "Books & Newspapers": 30
        }
    }
]


# =========================================================
# AI CLASSIFICATION
# =========================================================

def classify_image(image):

    category_names = list(MATERIALS.keys())

    text_prompts = []
    prompt_to_category = []

    for category in category_names:

        for prompt in MATERIALS[category]["prompts"]:

            text_prompts.append(prompt)
            prompt_to_category.append(category)

    inputs = processor(
        text=text_prompts,
        images=image,
        return_tensors="pt",
        padding=True
    )

    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }

    with torch.no_grad():

        outputs = model(**inputs)

    logits = outputs.logits_per_image[0]

    probabilities = torch.softmax(logits, dim=0)

    category_scores = {}

    for index, category in enumerate(prompt_to_category):

        score = float(probabilities[index])

        if category not in category_scores:
            category_scores[category] = []

        category_scores[category].append(score)

    averaged_scores = {
        category: sum(scores) / len(scores)
        for category, scores in category_scores.items()
    }

    best_category = max(
        averaged_scores,
        key=averaged_scores.get
    )

    raw_score = averaged_scores[best_category]

    confidence = min(
        98.0,
        max(
            55.0,
            70.0 + (raw_score * 100)
        )
    )

    return best_category, confidence


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return render_template(
        "index.html",
        materials=MATERIALS
    )


# =========================================================
# AI ANALYSIS
# =========================================================

@app.route("/analyze", methods=["POST"])
def analyze():

    if "image" not in request.files:

        return jsonify({
            "success": False,
            "error": "No image uploaded."
        }), 400

    file = request.files["image"]

    if file.filename == "":

        return jsonify({
            "success": False,
            "error": "Please select an image."
        }), 400

    try:

        image = Image.open(
            file.stream
        ).convert("RGB")

        category, confidence = classify_image(image)

        material = MATERIALS[category]

        safety_warning = ""

        if material["type"] == "E-Waste":

            safety_warning = (
                "Handle carefully. Avoid burning, breaking batteries "
                "or unsafe dismantling. Send e-waste to an authorized recycler."
            )

        elif category in ["Plastic", "Glass"]:

            safety_warning = (
                "Handle carefully and keep recyclable material separated."
            )

        return jsonify({

            "success": True,

            "material": category,

            "category": material["type"],

            "confidence": round(
                confidence,
                1
            ),

            "price_per_kg": material["rate"],

            "price_range": material["range"],

            "warning": safety_warning,

            "model": "CLIP zero-shot prototype",

            "weight": None,

            "estimated_value": None
        })

    except Exception as error:

        print(
            "Analysis error:",
            error
        )

        return jsonify({

            "success": False,

            "error": str(error)
        }), 500


# =========================================================
# RECYCLER MATCHING
# =========================================================

@app.route("/recyclers", methods=["POST"])
def find_recyclers():

    try:

        data = request.get_json() or {}

        material = data.get("material")

        weight = float(
            data.get(
                "weight",
                0
            )
        )

        if material not in MATERIALS:

            return jsonify({

                "success": False,

                "error": "Unknown material."
            }), 400

        results = []

        for recycler in RECYCLERS:

            rate = recycler["rates"].get(
                material,
                MATERIALS[material]["rate"]
            )

            estimated_value = round(
                rate * weight,
                2
            )

            results.append({

                "name": recycler["name"],

                "distance": recycler["distance"],

                "rating": recycler["rating"],

                "authorization": recycler["authorization"],

                "pickup": recycler["pickup"],

                "rate": rate,

                "estimated_value": estimated_value
            })

        results.sort(
            key=lambda item: item["rate"],
            reverse=True
        )

        return jsonify({

            "success": True,

            "material": material,

            "weight": weight,

            "recyclers": results
        })

    except Exception as error:

        return jsonify({

            "success": False,

            "error": str(error)
        }), 500


# =========================================================
# PICKUP REQUEST
# =========================================================

@app.route("/pickup", methods=["POST"])
def pickup_request():

    try:

        data = request.get_json() or {}

        material = data.get(
            "material",
            "Material"
        )

        weight = data.get(
            "weight",
            0
        )

        address = data.get(
            "address",
            "Household location"
        )

        request_id = (
            "KS-"
            + datetime.now().strftime("%Y%m%d")
            + "-"
            + datetime.now().strftime("%H%M%S")
        )

        return jsonify({

            "success": True,

            "request_id": request_id,

            "material": material,

            "weight": weight,

            "address": address,

            "status": "Pickup request created"
        })

    except Exception as error:

        return jsonify({

            "success": False,

            "error": str(error)
        }), 500


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/health")
def health():

    return jsonify({

        "status": "running",

        "application": "Kabadi Setu",

        "ai_model": MODEL_NAME,

        "device": device
    })


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    print("")
    print("=" * 55)
    print("       KABADI SETU")
    print("       AI-Powered Recycling Platform")
    print("=" * 55)
    print("")
    print("Server starting...")
    print("Open this in Chrome:")
    print("http://127.0.0.1:5000/")
    print("")
    print("Health check:")
    print("http://127.0.0.1:5000/health")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False,
        threaded=True
    )