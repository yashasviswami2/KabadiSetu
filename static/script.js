// =========================================================
// KABADI SETU - COMPLETE FRONTEND SCRIPT
// =========================================================

let currentMaterial = "";
let currentPrice = 0;
let currentWeight = 0;


// =========================================================
// ROLE SWITCH
// =========================================================

function switchRole(role) {

    const householdButton =
        document.getElementById("householdRole");

    const collectorButton =
        document.getElementById("collectorRole");

    if (role === "household") {

        if (householdButton) {
            householdButton.classList.add("active");
        }

        if (collectorButton) {
            collectorButton.classList.remove("active");
        }

        const title =
            document.getElementById("pageTitle");

        if (title) {
            title.innerText =
                "Give your waste a second life";
        }

        const profileRole =
            document.querySelector(".profile-role");

        if (profileRole) {
            profileRole.innerText =
                "Household User";
        }

        updateProfileRole("Household");

        showSection("dashboard");

        return;
    }


    if (role === "collector") {

        if (collectorButton) {
            collectorButton.classList.add("active");
        }

        if (householdButton) {
            householdButton.classList.remove("active");
        }

        const title =
            document.getElementById("pageTitle");

        if (title) {
            title.innerText =
                "Collector Dashboard";
        }

        const profileRole =
            document.querySelector(".profile-role");

        if (profileRole) {
            profileRole.innerText =
                "Collector";
        }

        updateProfileRole("Collector");

        showSection("inventory");

        renderCollectorDashboard();
    }
}


// =========================================================
// UPDATE PROFILE ROLE
// =========================================================

function updateProfileRole(role) {

    const rows =
        document.querySelectorAll(".profile-row");

    rows.forEach(row => {

        if (
            row.innerText &&
            row.innerText.toLowerCase().includes("role")
        ) {

            const strong =
                row.querySelector("strong");

            if (strong) {
                strong.innerText = role;
            }
        }
    });
}


// =========================================================
// SECTION NAVIGATION
// =========================================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".page-section");

    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    const selected =
        document.getElementById(sectionId);

    if (selected) {

        selected.classList.add(
            "active-section"
        );

    }


    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.classList.remove("active");

    });


    navItems.forEach(item => {

        const text =
            item.innerText.toLowerCase();

        if (
            (sectionId === "dashboard" &&
                text.includes("dashboard")) ||

            (sectionId === "scanner" &&
                text.includes("scanner")) ||

            (sectionId === "recyclers" &&
                text.includes("recycler")) ||

            (sectionId === "inventory" &&
                text.includes("inventory")) ||

            (sectionId === "earnings" &&
                text.includes("earnings")) ||

            (sectionId === "transactions" &&
                text.includes("transaction"))
        ) {

            item.classList.add("active");

        }

    });


    const title =
        document.getElementById("pageTitle");

    const titles = {

        dashboard:
            "Give your waste a second life",

        scanner:
            "AI Waste Scanner",

        recyclers:
            "Recycler Network",

        inventory:
            "My Inventory",

        earnings:
            "Collector Earnings",

        transactions:
            "Traceable Transactions"

    };


    if (title) {

        title.innerText =
            titles[sectionId] ||
            "Kabadi Setu";

    }

}


// =========================================================
// IMAGE PREVIEW
// =========================================================

function previewImage(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

        const image =
            document.getElementById(
                "previewImage"
            );

        if (image) {
            image.src =
                e.target.result;
        }


        const uploadArea =
            document.getElementById(
                "uploadArea"
            );

        if (uploadArea) {
            uploadArea.style.display =
                "none";
        }


        const previewContainer =
            document.getElementById(
                "previewContainer"
            );

        if (previewContainer) {

            previewContainer.style.display =
                "flex";

        }

    };


    reader.readAsDataURL(file);
}


// =========================================================
// AI ANALYSIS
// =========================================================

async function analyzeWaste() {

    const input =
        document.getElementById(
            "imageInput"
        );


    if (
        !input ||
        !input.files ||
        input.files.length === 0
    ) {

        alert(
            "Please select an image first."
        );

        return;
    }


    const formData =
        new FormData();

    formData.append(
        "image",
        input.files[0]
    );


    const button =
        document.querySelector(
            "#previewContainer .secondary-btn"
        );


    const oldText =
        button
            ? button.innerText
            : "Analyze";


    if (button) {

        button.innerText =
            "🤖 AI Analyzing...";

        button.disabled = true;

    }


    try {

        const response =
            await fetch(
                "/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Analysis failed."
            );

        }


        currentMaterial =
            data.material || "";

        currentPrice =
            Number(
                data.price_per_kg
            ) || 0;


        setText(
            "materialResult",
            data.material || "-"
        );

        setText(
            "categoryResult",
            data.category || "-"
        );

        setText(
            "confidenceResult",
            (data.confidence || 0) + "%"
        );

        setText(
            "rateResult",
            "₹" +
            (data.price_per_kg || 0) +
            "/kg"
        );

        setText(
            "rangeResult",
            data.price_range || "-"
        );

        setText(
            "modelName",
            data.model || "-"
        );


        const warningBox =
            document.getElementById(
                "warningBox"
            );


        if (warningBox) {

            if (data.warning) {

                warningBox.innerText =
                    "⚠ " +
                    data.warning;

                warningBox.style.display =
                    "block";

            } else {

                warningBox.style.display =
                    "none";

            }

        }


        updateValue();


        const resultCard =
            document.getElementById(
                "resultCard"
            );


        if (resultCard) {

            resultCard.classList.add(
                "result-ready"
            );

        }


        showToast(
            "AI analysis completed successfully."
        );


    } catch (error) {

        console.error(error);

        alert(
            "AI analysis failed: " +
            error.message
        );


    } finally {

        if (button) {

            button.innerText =
                oldText;

            button.disabled =
                false;

        }

    }
}


// =========================================================
// HELPER - SET TEXT
// =========================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.innerText = value;
    }

}


// =========================================================
// VALUE CALCULATION
// =========================================================

function updateValue() {

    const weightInput =
        document.getElementById(
            "weightInput"
        );


    currentWeight =
        weightInput
            ? Number(weightInput.value) || 0
            : 0;


    const value =
        currentWeight *
        currentPrice;


    const valueResult =
        document.getElementById(
            "valueResult"
        );


    if (valueResult) {

        valueResult.innerText =
            "₹" +
            value.toFixed(2);

    }

}


// =========================================================
// PICKUP
// =========================================================
// =========================================================
// REQUEST COLLECTOR PICKUP
// =========================================================

window.requestPickup = function () {

    console.log("Request Collector Pickup clicked");

    // Get detected material
    const material =
        window.currentMaterial ||
        currentMaterial;

    if (!material) {
        alert("Please analyze an image first.");
        return;
    }

    // Get actual physical weight
    const weightInput =
        document.getElementById("weightInput");

    if (!weightInput) {
        alert("Weight field not found.");
        console.error("weightInput element not found.");
        return;
    }

    const weight =
        Number(weightInput.value);

    if (!weight || weight <= 0) {
        alert(
            "Please enter the actual physical weight before requesting pickup."
        );
        weightInput.focus();
        return;
    }

    // Open pickup address modal
    const modal =
        document.getElementById("pickupModal");

    if (!modal) {
        alert("Pickup window could not be opened.");
        console.error("pickupModal element not found.");
        return;
    }

    modal.style.display = "flex";

    console.log(
        "Pickup modal opened:",
        material,
        weight
    );
};


// =========================================================
// CONFIRM PICKUP
// =========================================================

window.confirmPickup = async function () {

    console.log("Confirm Pickup clicked");

    const addressInput =
        document.getElementById("addressInput");

    if (!addressInput) {
        alert("Pickup address field not found.");
        return;
    }

    const address =
        addressInput.value.trim();

    if (!address) {
        alert("Please enter your pickup location.");
        addressInput.focus();
        return;
    }

    const material =
        window.currentMaterial ||
        currentMaterial;

    const weightInput =
        document.getElementById("weightInput");

    const weight =
        weightInput
            ? Number(weightInput.value)
            : 0;

    if (!material) {
        alert("Material information is missing.");
        return;
    }

    if (!weight || weight <= 0) {
        alert("Please enter a valid physical weight.");
        return;
    }

    try {

        console.log(
            "Sending pickup request:",
            {
                material: material,
                weight: weight,
                address: address
            }
        );

        const response =
            await fetch("/pickup", {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    material: material,
                    weight: weight,
                    address: address
                })
            });

        const data =
            await response.json();

        console.log(
            "Pickup response:",
            data
        );

        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Pickup request failed."
            );

        }

        // Add request to collector dashboard
        if (
            typeof addPickupToCollectorQueue ===
            "function"
        ) {

            addPickupToCollectorQueue(
                data.material,
                data.weight,
                address,
                data.request_id
            );

        }

        // Close modal
        closeModal();

        // Clear address
        addressInput.value = "";

        // Success message
        alert(
            "Pickup requested successfully!\n\n" +
            "Request ID: " +
            data.request_id +
            "\n\n" +
            "Material: " +
            data.material +
            "\n" +
            "Weight: " +
            data.weight +
            " kg"
        );

        console.log(
            "Pickup successfully created:",
            data.request_id
        );

    } catch (error) {

        console.error(
            "Pickup request error:",
            error
        );

        alert(
            "Pickup request failed:\n\n" +
            error.message
        );

    }

};


// =========================================================
// CLOSE PICKUP MODAL
// =========================================================

window.closeModal = function () {

    const modal =
        document.getElementById("pickupModal");

    if (modal) {
        modal.style.display = "none";
    }

};


// =========================================================
// RECYCLER RATES
// =========================================================

async function loadRecyclerRates() {

    const materialElement =
        document.getElementById(
            "recyclerMaterial"
        );


    const weightElement =
        document.getElementById(
            "recyclerWeight"
        );


    if (
        !materialElement ||
        !weightElement
    ) {
        return;
    }


    const material =
        materialElement.value;


    const weight =
        Number(
            weightElement.value
        ) || 0;


    if (weight <= 0) {

        alert(
            "Enter a valid weight."
        );

        return;
    }


    const container =
        document.getElementById(
            "recyclerResults"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<div class='loading'>Finding best recycler...</div>";


    try {

        const response =
            await fetch(
                "/recyclers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            material:
                                material,

                            weight:
                                weight

                        })
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Could not load recycler rates."
            );

        }


        container.innerHTML = "";


        if (
            !data.recyclers ||
            data.recyclers.length === 0
        ) {

            container.innerHTML = `
                <div class="error-state">
                    No verified recycler found.
                </div>
            `;

            return;
        }


        data.recyclers.forEach(
            (recycler, index) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "recycler-card";


                const best =
                    index === 0
                        ? "<span class='best-badge'>BEST PRICE</span>"
                        : "";


                const pickup =
                    recycler.pickup
                        ? "🚚 Pickup available"
                        : "📍 Drop-off";


                card.innerHTML = `

                    <div class="recycler-info">

                        <div class="recycler-title">

                            <h3>
                                ${recycler.name}
                            </h3>

                            ${best}

                        </div>

                        <p>
                            📍 ${recycler.distance}
                            &nbsp; • &nbsp;
                            ⭐ ${recycler.rating}
                        </p>

                        <small>
                            ✓ ${recycler.authorization}
                            &nbsp; • &nbsp;
                            ${pickup}
                        </small>

                    </div>


                    <div class="recycler-price">

                        <span>
                            ₹${recycler.rate}/kg
                        </span>

                        <strong>
                            ₹${Number(
                                recycler.estimated_value
                            ).toFixed(2)}
                        </strong>

                        <small>
                            Estimated value
                        </small>

                    </div>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="error-state">

                ❌ ${error.message}

            </div>

        `;

    }

}


// =========================================================
// OPEN RECYCLER FOR COLLECTED MATERIAL
// =========================================================

function openRecyclerForCollected(
    material,
    weight
) {

    const select =
        document.getElementById(
            "recyclerMaterial"
        );


    const weightInput =
        document.getElementById(
            "recyclerWeight"
        );


    if (select) {

        const option =
            Array.from(
                select.options
            ).find(
                option =>
                    option.value ===
                    material
            );


        if (option) {

            select.value =
                material;

        }

    }


    if (weightInput) {

        weightInput.value =
            weight;

    }


    showSection(
        "recyclers"
    );


    loadRecyclerRates();

}


// =========================================================
// COLLECTOR DATA
// =========================================================

let collectorRequests = [

    {
        id:
            "KS-20260912-001",

        material:
            "Printed Circuit Board",

        category:
            "E-Waste",

        weight:
            2.5,

        address:
            "Mody University Campus",

        status:
            "Pending",

        indicativeRate:
            220,

        payment:
            ""

    },

    {
        id:
            "KS-20260912-002",

        material:
            "Copper Cable",

        category:
            "E-Waste",

        weight:
            3.0,

        address:
            "Laxmangarh",

        status:
            "Pending",

        indicativeRate:
            380,

        payment:
            ""

    }

];


let collectorInventory = [];

let collectorEarnings = 0;

let collectorTransactions = [];

let activeCollectorRequest = null;


// =========================================================
// ADD HOUSEHOLD PICKUP TO COLLECTOR QUEUE
// =========================================================

function addPickupToCollectorQueue(
    material,
    weight,
    address,
    requestId
) {

    collectorRequests.unshift({

        id:
            requestId,

        material:
            material,

        category:
            "Household Pickup",

        weight:
            Number(weight),

        address:
            address,

        status:
            "Pending",

        indicativeRate:
            currentPrice || 0,

        payment:
            ""

    });


    showToast(
        "New household pickup added to collector queue."
    );

}


// =========================================================
// COLLECTOR DASHBOARD
// =========================================================

function renderCollectorDashboard() {

    const section =
        document.getElementById(
            "inventory"
        );


    if (!section) {
        return;
    }


    let panel =
        document.getElementById(
            "collectorPanel"
        );


    if (!panel) {

        panel =
            document.createElement(
                "div"
            );

        panel.id =
            "collectorPanel";

        panel.className =
            "collector-panel";

        section.prepend(
            panel
        );

    }


    const pending =
        collectorRequests.filter(
            request =>
                request.status ===
                "Pending"
        );


    panel.innerHTML = `

        <!-- COLLECTOR HEADER -->

        <div style="
            background:#fff;
            border-radius:18px;
            padding:24px;
            margin-bottom:24px;
            box-shadow:0 8px 24px rgba(0,0,0,.06);
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:16px;
                flex-wrap:wrap;
            ">

                <div>

                    <h2 style="margin:0 0 6px;">
                        🚚 Collector Dashboard
                    </h2>

                    <p style="
                        margin:0;
                        color:#6b7280;
                    ">
                        Manage household pickups,
                        payments and collected material.
                    </p>

                </div>


                <div style="
                    padding:12px 18px;
                    border-radius:12px;
                    background:#f3fdf7;
                ">

                    <small style="color:#6b7280;">
                        Today's Earnings
                    </small>

                    <strong style="
                        display:block;
                        font-size:22px;
                    ">
                        ₹${collectorEarnings.toFixed(2)}
                    </strong>

                </div>

            </div>

        </div>


        <!-- PICKUP REQUESTS -->

        <div style="
            background:#fff;
            border-radius:18px;
            padding:24px;
            margin-bottom:24px;
            box-shadow:0 8px 24px rgba(0,0,0,.06);
        ">

            <h3 style="margin-top:0;">
                📥 Incoming Pickup Requests
            </h3>


            <div id="collectorRequests">

                ${
                    pending.length
                    ?

                    pending.map(
                        request => `

                            <div style="
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                                padding:18px;
                                margin-top:14px;
                            ">

                                <div style="
                                    display:flex;
                                    justify-content:space-between;
                                    gap:16px;
                                    flex-wrap:wrap;
                                ">

                                    <div>

                                        <strong>
                                            ${request.material}
                                        </strong>

                                        <div style="
                                            color:#6b7280;
                                            margin-top:6px;
                                        ">
                                            ${request.category}
                                            •
                                            ${request.weight}
                                            kg estimated
                                        </div>

                                        <div style="
                                            color:#6b7280;
                                            margin-top:4px;
                                        ">
                                            📍 ${request.address}
                                        </div>

                                        <small style="
                                            display:block;
                                            margin-top:8px;
                                        ">
                                            Request ID:
                                            ${request.id}
                                        </small>

                                    </div>


                                    <button
                                        class="primary-btn"
                                        type="button"
                                        onclick="acceptCollectorRequest('${request.id}')"
                                    >
                                        Accept Pickup
                                    </button>

                                </div>

                            </div>

                        `
                    ).join("")

                    :

                    `
                    <div style="
                        padding:20px;
                        text-align:center;
                        color:#6b7280;
                    ">
                        No pending pickup requests.
                    </div>
                    `
                }

            </div>

        </div>


        <!-- SMART INVENTORY -->

        <div id="collectorInventorySummary"
             style="
                background:#fff;
                border-radius:18px;
                padding:24px;
                margin-bottom:24px;
                box-shadow:0 8px 24px rgba(0,0,0,.06);
             ">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:12px;
                flex-wrap:wrap;
                margin-bottom:6px;
            ">

                <div>

                    <h3 style="
                        margin:0;
                        font-size:20px;
                    ">
                        ♻️ Collected Inventory
                    </h3>

                    <p style="
                        margin:5px 0 0;
                        color:#6b7280;
                        font-size:14px;
                    ">
                        Find the best authorized recycler
                        for your collected material.
                    </p>

                </div>


                <div style="
                    background:#eefbf3;
                    color:#16803c;
                    padding:7px 12px;
                    border-radius:20px;
                    font-size:13px;
                    font-weight:700;
                    white-space:nowrap;
                ">
                    ${collectorInventory.length}
                    Item${collectorInventory.length !== 1 ? "s" : ""}
                </div>

            </div>


            ${
                collectorInventory.length

                ?

                collectorInventory.map(
                    (item, index) => `

                        <div
                            id="inventoryItem-${index}"
                            style="
                                margin-top:16px;
                                padding:16px;
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                                background:#fafafa;
                            "
                        >

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                align-items:flex-start;
                                gap:15px;
                            ">

                                <div>

                                    <div style="
                                        font-size:17px;
                                        font-weight:700;
                                        color:#111827;
                                    ">
                                        ${item.material}
                                    </div>


                                    <div style="
                                        margin-top:5px;
                                        color:#6b7280;
                                        font-size:14px;
                                    ">
                                        Collected Weight:
                                        <strong style="
                                            color:#111827;
                                        ">
                                            ${Number(
                                                item.weight
                                            ).toFixed(2)}
                                            kg
                                        </strong>
                                    </div>


                                    <div style="
                                        display:inline-block;
                                        margin-top:8px;
                                        padding:4px 9px;
                                        background:#ecfdf5;
                                        color:#047857;
                                        border-radius:20px;
                                        font-size:11px;
                                        font-weight:700;
                                    ">
                                        IN INVENTORY
                                    </div>

                                </div>


                                <div style="
                                    text-align:right;
                                    min-width:130px;
                                ">

                                    <div style="
                                        font-size:12px;
                                        color:#6b7280;
                                    ">
                                        Household Rate
                                    </div>

                                    <div style="
                                        font-size:18px;
                                        font-weight:800;
                                        color:#111827;
                                    ">
                                        ₹${Number(
                                            item.indicativeRate || 0
                                        ).toFixed(0)}/kg
                                    </div>

                                </div>

                            </div>


                            <!-- BEST RECYCLER -->

                            <div
                                id="bestRecycler-${index}"
                                style="
                                    margin-top:14px;
                                    padding:13px;
                                    background:#f8fafc;
                                    border-radius:12px;
                                    border:1px solid #e2e8f0;
                                "
                            >

                                <div style="
                                    font-size:13px;
                                    color:#6b7280;
                                ">
                                    🏆 Best Recycler
                                </div>

                                <div style="
                                    margin-top:5px;
                                    color:#374151;
                                    font-weight:600;
                                ">
                                    Checking recycler rates...
                                </div>

                            </div>


                            <!-- ACTIONS -->

                            <div style="
                                display:flex;
                                gap:10px;
                                margin-top:14px;
                                flex-wrap:wrap;
                            ">

                                <button
                                    type="button"
                                    onclick="openRecyclerForCollected(
                                        '${item.material}',
                                        ${Number(item.weight)}
                                    )"
                                    style="
                                        flex:1;
                                        min-width:180px;
                                        border:none;
                                        border-radius:10px;
                                        padding:11px 14px;
                                        background:#111827;
                                        color:white;
                                        font-weight:700;
                                        cursor:pointer;
                                    "
                                >
                                    🏆 Compare Recycler Rates
                                </button>


                                <button
                                    type="button"
                                    onclick="prepareInventoryHandover(${index})"
                                    style="
                                        flex:1;
                                        min-width:180px;
                                        border:none;
                                        border-radius:10px;
                                        padding:11px 14px;
                                        background:#16a34a;
                                        color:white;
                                        font-weight:700;
                                        cursor:pointer;
                                    "
                                >
                                    📦 Prepare Handover
                                </button>

                            </div>

                        </div>

                    `
                ).join("")

                :

                `
                <div style="
                    text-align:center;
                    padding:35px 15px;
                    color:#6b7280;
                ">

                    <div style="
                        font-size:40px;
                    ">
                        📦
                    </div>

                    <div style="
                        margin-top:8px;
                        font-weight:700;
                        color:#374151;
                    ">
                        No collected material yet
                    </div>

                    <div style="
                        margin-top:4px;
                        font-size:13px;
                    ">
                        Completed household collections
                        will appear here.
                    </div>

                </div>
                `
            }

        </div>


        <!-- COLLECTOR SUMMARY -->

        <div style="
            display:grid;
            grid-template-columns:
                repeat(auto-fit,minmax(180px,1fr));
            gap:16px;
        ">

            <div style="
                background:#fff;
                padding:20px;
                border-radius:16px;
                box-shadow:0 5px 18px rgba(0,0,0,.05);
            ">

                <small style="color:#6b7280;">
                    Pending Pickups
                </small>

                <div style="
                    font-size:25px;
                    font-weight:800;
                    margin-top:5px;
                ">
                    ${pending.length}
                </div>

            </div>


            <div style="
                background:#fff;
                padding:20px;
                border-radius:16px;
                box-shadow:0 5px 18px rgba(0,0,0,.05);
            ">

                <small style="color:#6b7280;">
                    Inventory Items
                </small>

                <div style="
                    font-size:25px;
                    font-weight:800;
                    margin-top:5px;
                ">
                    ${collectorInventory.length}
                </div>

            </div>


            <div style="
                background:#fff;
                padding:20px;
                border-radius:16px;
                box-shadow:0 5px 18px rgba(0,0,0,.05);
            ">

                <small style="color:#6b7280;">
                    Transactions
                </small>

                <div style="
                    font-size:25px;
                    font-weight:800;
                    margin-top:5px;
                ">
                    ${collectorTransactions.length}
                </div>

            </div>

        </div>

    `;


    // IMPORTANT:
    // The HTML above is inserted first.
    // Then recycler recommendations are loaded.

    loadInventoryRecyclerRecommendations();

}


// =========================================================
// ACCEPT PICKUP
// =========================================================

function acceptCollectorRequest(
    requestId
) {

    const request =
        collectorRequests.find(
            r =>
                r.id === requestId
        );


    if (!request) {
        return;
    }


    activeCollectorRequest =
        request;


    request.status =
        "Accepted";


    showCollectorWeightModal(
        request
    );

}


// =========================================================
// COLLECTOR WEIGHT MODAL
// =========================================================

function showCollectorWeightModal(
    request
) {

    let modal =
        document.getElementById(
            "collectorWeightModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "collectorWeightModal";

        modal.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.5);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:9999;
            padding:20px;
        `;

        document.body.appendChild(
            modal
        );

    }


    const estimatedValue =
        Number(request.weight) *
        Number(request.indicativeRate);


    modal.innerHTML = `

        <div style="
            background:#fff;
            border-radius:20px;
            padding:28px;
            width:min(480px,100%);
            box-shadow:0 20px 60px rgba(0,0,0,.2);
        ">

            <h2 style="margin-top:0;">
                ⚖️ Complete Collection
            </h2>


            <p style="color:#6b7280;">

                <strong>
                    ${request.material}
                </strong>

                <br>

                📍 ${request.address}

                <br>

                Estimated weight:
                ${request.weight} kg

            </p>


            <label style="
                display:block;
                font-weight:600;
                margin:20px 0 8px;
            ">
                Actual physical weight (kg)
            </label>


            <input
                id="collectorActualWeight"
                type="number"
                min="0.01"
                step="0.01"
                value="${request.weight}"
                oninput="updateCollectorFinalValue()"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:13px;
                    border:1px solid #d1d5db;
                    border-radius:10px;
                    font-size:16px;
                "
            >


            <div style="
                background:#f8fafc;
                border-radius:12px;
                padding:16px;
                margin:18px 0;
            ">

                <div style="
                    color:#6b7280;
                    font-size:13px;
                ">
                    Indicative rate
                </div>

                <strong>
                    ₹${request.indicativeRate}/kg
                </strong>


                <div style="
                    color:#6b7280;
                    font-size:13px;
                    margin-top:10px;
                ">
                    Final payout
                </div>


                <strong
                    id="collectorFinalValue"
                    style="font-size:24px;"
                >
                    ₹${estimatedValue.toFixed(2)}
                </strong>

            </div>


            <label style="
                display:block;
                font-weight:600;
                margin-bottom:8px;
            ">
                Payment method
            </label>


            <div style="
                display:flex;
                gap:12px;
                margin-bottom:22px;
            ">

                <label style="
                    flex:1;
                    border:1px solid #d1d5db;
                    border-radius:10px;
                    padding:12px;
                ">

                    <input
                        type="radio"
                        name="collectorPayment"
                        value="UPI"
                        checked
                    >

                    📱 UPI

                </label>


                <label style="
                    flex:1;
                    border:1px solid #d1d5db;
                    border-radius:10px;
                    padding:12px;
                ">

                    <input
                        type="radio"
                        name="collectorPayment"
                        value="Cash"
                    >

                    💵 Cash

                </label>

            </div>


            <div style="
                display:flex;
                gap:10px;
            ">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeCollectorWeightModal()"
                    style="flex:1;"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="primary-btn"
                    onclick="completeCollectorCollection()"
                    style="flex:1;"
                >
                    Complete Collection
                </button>

            </div>

        </div>

    `;


    modal.style.display =
        "flex";

}


// =========================================================
// UPDATE FINAL VALUE
// =========================================================

function updateCollectorFinalValue() {

    if (!activeCollectorRequest) {
        return;
    }


    const input =
        document.getElementById(
            "collectorActualWeight"
        );


    const output =
        document.getElementById(
            "collectorFinalValue"
        );


    if (!input || !output) {
        return;
    }


    const weight =
        Number(input.value) || 0;


    const value =
        weight *
        Number(
            activeCollectorRequest.indicativeRate
        );


    output.innerText =
        "₹" +
        value.toFixed(2);

}


// =========================================================
// CLOSE COLLECTOR MODAL
// =========================================================

function closeCollectorWeightModal() {

    const modal =
        document.getElementById(
            "collectorWeightModal"
        );


    if (modal) {
        modal.remove();
    }


    if (
        activeCollectorRequest &&
        activeCollectorRequest.status ===
            "Accepted"
    ) {

        activeCollectorRequest.status =
            "Pending";

    }


    activeCollectorRequest =
        null;


    renderCollectorDashboard();

}


// =========================================================
// COMPLETE COLLECTION
// =========================================================

function completeCollectorCollection() {

    if (!activeCollectorRequest) {
        return;
    }


    const input =
        document.getElementById(
            "collectorActualWeight"
        );


    const weight =
        Number(
            input
                ? input.value
                : 0
        );


    if (weight <= 0) {

        alert(
            "Please enter the actual physical weight."
        );

        return;
    }


    const paymentInput =
        document.querySelector(
            'input[name="collectorPayment"]:checked'
        );


    const payment =
        paymentInput
            ? paymentInput.value
            : "UPI";


    const request =
        activeCollectorRequest;


    const finalValue =
        weight *
        Number(
            request.indicativeRate
        );


    request.status =
        "Completed";

    request.finalWeight =
        weight;

    request.finalValue =
        finalValue;

    request.payment =
        payment;


    collectorEarnings +=
        finalValue;


    // Add material to inventory

    collectorInventory.push({

        material:
            request.material,

        weight:
            weight,

        indicativeRate:
            Number(
                request.indicativeRate
            ) || 0,

        requestId:
            request.id

    });


    // Create transaction

    const now =
        new Date();


    const transactionId =
        "TX-" +
        now.getFullYear() +
        String(
            now.getMonth() + 1
        ).padStart(2, "0") +
        String(
            now.getDate()
        ).padStart(2, "0") +
        "-" +
        String(
            Date.now()
        ).slice(-5);


    request.transactionId =
        transactionId;


    collectorTransactions.unshift({

        id:
            transactionId,

        material:
            request.material,

        weight:
            weight,

        amount:
            finalValue,

        payment:
            payment,

        status:
            "Collected",

        date:
            now.toLocaleString()

    });


    const modal =
        document.getElementById(
            "collectorWeightModal"
        );


    if (modal) {
        modal.remove();
    }


    activeCollectorRequest =
        null;


    renderCollectorDashboard();

    renderCollectorEarnings();

    renderCollectorTransactions();


    showCollectorSuccess(
        request,
        transactionId
    );

}


// =========================================================
// COLLECTION SUCCESS
// =========================================================

function showCollectorSuccess(
    request,
    transactionId
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.5);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:10000;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div style="
            background:#fff;
            border-radius:20px;
            padding:30px;
            width:min(460px,100%);
            text-align:center;
            box-shadow:0 20px 60px rgba(0,0,0,.2);
        ">

            <div style="font-size:48px;">
                ✅
            </div>


            <h2>
                Collection Completed
            </h2>


            <p style="color:#6b7280;">

                ${request.material}

                <br>

                ${request.finalWeight.toFixed(2)}
                kg

            </p>


            <div style="
                background:#f3fdf7;
                border-radius:14px;
                padding:18px;
                margin:18px 0;
            ">

                <small>
                    Final Amount Paid
                </small>


                <div style="
                    font-size:28px;
                    font-weight:700;
                ">
                    ₹${request.finalValue.toFixed(2)}
                </div>


                <div style="margin-top:6px;">
                    Payment:
                    ${request.payment}
                </div>

            </div>


            <div style="
                font-size:13px;
                color:#6b7280;
                margin-bottom:20px;
            ">

                Transaction ID:

                <strong>
                    ${transactionId}
                </strong>

            </div>


            <button
                type="button"
                class="primary-btn"
                onclick="closeCollectorSuccess(this)"
            >
                Done
            </button>


            <button
                type="button"
                class="secondary-btn"
                onclick="
                    closeCollectorSuccess(this);
                    openRecyclerForCollected(
                        '${request.material}',
                        ${request.finalWeight}
                    );
                "
                style="margin-left:8px;"
            >
                Find Best Recycler
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// =========================================================
// CLOSE SUCCESS
// =========================================================

function closeCollectorSuccess(
    button
) {

    const overlay =
        button.closest(
            "div[style*='position:fixed']"
        );


    if (overlay) {
        overlay.remove();
    }

}


// =========================================================
// SMART INVENTORY - BEST RECYCLER
// =========================================================

async function loadBestRecyclerForInventoryItem(
    index
) {

    const item =
        collectorInventory[index];


    if (!item) {
        return;
    }


    const resultBox =
        document.getElementById(
            `bestRecycler-${index}`
        );


    if (!resultBox) {
        return;
    }


    resultBox.innerHTML = `

        <div style="
            font-size:13px;
            color:#6b7280;
        ">
            🏆 Best Recycler
        </div>

        <div style="
            margin-top:5px;
            color:#374151;
            font-weight:600;
        ">
            Checking live recycler rates...
        </div>

    `;


    try {

        // IMPORTANT:
        // Backend /recyclers uses POST,
        // not GET.

        const response =
            await fetch(
                "/recyclers",
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            material:
                                item.material,

                            weight:
                                Number(
                                    item.weight
                                )

                        })
                }
            );


        const data =
            await response.json();


        if (
            !data.success ||
            !data.recyclers ||
            data.recyclers.length === 0
        ) {

            resultBox.innerHTML = `

                <div style="
                    font-size:13px;
                    color:#6b7280;
                ">
                    🏆 Best Recycler
                </div>

                <div style="
                    margin-top:5px;
                    color:#dc2626;
                    font-weight:600;
                ">
                    No verified recycler found.
                </div>

            `;

            return;
        }


        const best =
            data.recyclers[0];


        const rate =
            Number(
                best.rate
            ) || 0;


        const weight =
            Number(
                item.weight
            ) || 0;


        const estimatedValue =
            Number(
                best.estimated_value
            ) ||
            rate * weight;


        resultBox.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:10px;
            ">

                <div>

                    <div style="
                        font-size:12px;
                        color:#6b7280;
                    ">
                        🏆 BEST RECYCLER
                    </div>


                    <div style="
                        margin-top:4px;
                        font-size:16px;
                        font-weight:800;
                        color:#111827;
                    ">
                        ${best.name}
                    </div>


                    <div style="
                        margin-top:4px;
                        font-size:13px;
                        color:#6b7280;
                    ">
                        📍 ${best.distance}
                        &nbsp; • &nbsp;
                        ⭐ ${best.rating}
                    </div>

                </div>


                <div style="
                    text-align:right;
                ">

                    <div style="
                        font-size:12px;
                        color:#6b7280;
                    ">
                        Recycler Rate
                    </div>


                    <div style="
                        font-size:19px;
                        font-weight:800;
                        color:#16803c;
                    ">
                        ₹${rate.toFixed(0)}/kg
                    </div>

                </div>

            </div>


            <div style="
                margin-top:10px;
                padding-top:10px;
                border-top:1px solid #e5e7eb;
                font-size:13px;
            ">

                Estimated recycler payout:

                <strong style="
                    font-size:15px;
                ">
                    ₹${estimatedValue.toFixed(2)}
                </strong>

            </div>


            <div style="
                margin-top:6px;
                font-size:11px;
                color:#16803c;
                font-weight:700;
            ">
                ✓ Verified Recycler
            </div>

        `;


    } catch (error) {

        console.error(
            "Best recycler error:",
            error
        );


        resultBox.innerHTML = `

            <div style="
                font-size:13px;
                color:#6b7280;
            ">
                🏆 Best Recycler
            </div>


            <div style="
                margin-top:5px;
                color:#dc2626;
                font-weight:600;
            ">
                Unable to load recycler rates.
            </div>

        `;

    }

}


// =========================================================
// LOAD ALL INVENTORY RECOMMENDATIONS
// =========================================================

function loadInventoryRecyclerRecommendations() {

    collectorInventory.forEach(
        (item, index) => {

            loadBestRecyclerForInventoryItem(
                index
            );

        }
    );

}


// =========================================================
// PREPARE INVENTORY HANDOVER
// =========================================================

function prepareInventoryHandover(
    index
) {

    const item =
        collectorInventory[index];


    if (!item) {
        return;
    }


    activeCollectorRequest = {

        id:
            "INV-" +
            Date.now(),

        material:
            item.material,

        weight:
            Number(item.weight),

        indicativeRate:
            Number(
                item.indicativeRate || 0
            ),

        status:
            "Ready for Handover"

    };


    const result =
        document.getElementById(
            `bestRecycler-${index}`
        );


    if (result) {

        result.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });


        result.style.border =
            "2px solid #16a34a";


        setTimeout(
            () => {

                result.style.border =
                    "1px solid #e2e8f0";

            },
            2500
        );

    }


    showHandoverModal(
        item,
        index
    );

}


// =========================================================
// HANDOVER MODAL
// =========================================================

function showHandoverModal(
    item,
    index
) {

    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "inventoryHandoverModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:11000;
        padding:20px;
    `;


    modal.innerHTML = `

        <div style="
            background:white;
            width:min(480px,100%);
            border-radius:20px;
            padding:28px;
            box-shadow:0 20px 60px rgba(0,0,0,.25);
        ">

            <div style="
                text-align:center;
                font-size:45px;
            ">
                📦
            </div>


            <h2 style="
                text-align:center;
                margin-top:8px;
            ">
                Prepare Recycler Handover
            </h2>


            <div style="
                background:#f8fafc;
                padding:16px;
                border-radius:14px;
                margin:18px 0;
            ">

                <strong>
                    ${item.material}
                </strong>

                <div style="
                    margin-top:7px;
                    color:#6b7280;
                ">
                    Weight:
                    ${Number(item.weight).toFixed(2)}
                    kg
                </div>

            </div>


            <div style="
                padding:14px;
                background:#ecfdf5;
                border-radius:12px;
                color:#047857;
                font-size:14px;
            ">
                ✓ Material verified<br>
                ✓ Physical weight recorded<br>
                ✓ Ready for recycler comparison
            </div>


            <div style="
                display:flex;
                gap:10px;
                margin-top:20px;
            ">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeHandoverModal()"
                    style="flex:1;"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="primary-btn"
                    onclick="
                        closeHandoverModal();
                        openRecyclerForCollected(
                            '${item.material}',
                            ${Number(item.weight)}
                        );
                    "
                    style="flex:1;"
                >
                    🏆 Select Recycler
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


// =========================================================
// CLOSE HANDOVER
// =========================================================

function closeHandoverModal() {

    const modal =
        document.getElementById(
            "inventoryHandoverModal"
        );


    if (modal) {
        modal.remove();
    }

}


// =========================================================
// EARNINGS
// =========================================================

function renderCollectorEarnings() {

    const section =
        document.getElementById(
            "earnings"
        );


    if (!section) {
        return;
    }


    let box =
        document.getElementById(
            "collectorEarningsPanel"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "collectorEarningsPanel";

        section.prepend(
            box
        );

    }


    box.innerHTML = `

        <div style="
            background:white;
            border-radius:18px;
            padding:25px;
            box-shadow:0 8px 24px rgba(0,0,0,.06);
        ">

            <h2>
                💰 Collector Earnings
            </h2>

            <div style="
                font-size:36px;
                font-weight:800;
                margin:15px 0;
            ">
                ₹${collectorEarnings.toFixed(2)}
            </div>

            <p style="
                color:#6b7280;
            ">
                Total earnings from completed
                household collections.
            </p>

        </div>

    `;

}


// =========================================================
// TRANSACTIONS
// =========================================================

function renderCollectorTransactions() {

    const section =
        document.getElementById(
            "transactions"
        );


    if (!section) {
        return;
    }


    let box =
        document.getElementById(
            "collectorTransactionsPanel"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "collectorTransactionsPanel";

        section.prepend(
            box
        );

    }


    box.innerHTML = `

        <div style="
            background:white;
            border-radius:18px;
            padding:25px;
            box-shadow:0 8px 24px rgba(0,0,0,.06);
        ">

            <h2>
                🔗 Traceable Transactions
            </h2>


            ${
                collectorTransactions.length

                ?

                collectorTransactions.map(
                    transaction => `

                        <div style="
                            border:1px solid #e5e7eb;
                            border-radius:14px;
                            padding:16px;
                            margin-top:12px;
                        ">

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                gap:15px;
                                flex-wrap:wrap;
                            ">

                                <div>

                                    <strong>
                                        ${transaction.material}
                                    </strong>

                                    <div style="
                                        color:#6b7280;
                                        margin-top:5px;
                                    ">
                                        ${transaction.weight}
                                        kg
                                        •
                                        ${transaction.payment}
                                    </div>

                                    <small>
                                        ${transaction.id}
                                    </small>

                                </div>


                                <div style="
                                    font-size:19px;
                                    font-weight:800;
                                ">
                                    ₹${transaction.amount.toFixed(2)}
                                </div>

                            </div>

                        </div>

                    `
                ).join("")

                :

                `
                <div style="
                    padding:25px;
                    text-align:center;
                    color:#6b7280;
                ">
                    No transactions yet.
                </div>
                `
            }

        </div>

    `;

}


// =========================================================
// PROFILE
// =========================================================

function openProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


function closeProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// =========================================================
// TOAST
// =========================================================

function showToast(message) {

    const old =
        document.getElementById(
            "kabadiToast"
        );


    if (old) {
        old.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.id =
        "kabadiToast";


    toast.innerText =
        message;


    toast.style.cssText = `
        position:fixed;
        right:24px;
        bottom:24px;
        background:#111827;
        color:white;
        padding:14px 18px;
        border-radius:12px;
        box-shadow:0 10px 30px rgba(0,0,0,.2);
        z-index:20000;
        font-size:14px;
        font-weight:600;
        max-width:350px;
    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            if (toast) {
                toast.remove();
            }

        },
        3000
    );

}


// =========================================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// =========================================================

window.addEventListener(
    "click",
    function(event) {

        const pickupModal =
            document.getElementById(
                "pickupModal"
            );


        if (
            pickupModal &&
            event.target ===
                pickupModal
        ) {

            closeModal();

        }


        const profileModal =
            document.getElementById(
                "profileModal"
            );


        if (
            profileModal &&
            event.target ===
                profileModal
        ) {

            closeProfile();

        }

    }
);


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

            closeProfile();

            closeCollectorWeightModal();

            closeHandoverModal();

        }

    }
);


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Default household mode

        const householdButton =
            document.getElementById(
                "householdRole"
            );


        const collectorButton =
            document.getElementById(
                "collectorRole"
            );


        if (
            householdButton &&
            !collectorButton?.classList.contains("active")
        ) {

            householdButton.classList.add(
                "active"
            );

        }


        // Update value when weight changes

        const weightInput =
            document.getElementById(
                "weightInput"
            );


        if (weightInput) {

            weightInput.addEventListener(
                "input",
                updateValue
            );

        }


        // Initial sections

        renderCollectorEarnings();

        renderCollectorTransactions();

    }
);

// =========================================================
// RECYCLER HANDOVER SYSTEM
// =========================================================

// NOTE: activeHandover is declared once globally and reused by the
// handover modal flow to avoid duplicate block-scoped redeclarations.
let activeHandover = null;

let handoverCounter = 1;


// =========================================================
// PREPARE HANDOVER
// =========================================================

async function prepareRecyclerHandover(index) {

    const item =
        collectorInventory[index];

    if (!item) {
        alert("Inventory item not found.");
        return;
    }


    // Show loading message first

    showToast(
        "Finding the best recycler..."
    );


    try {

        const response =
            await fetch(
                "/recyclers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            material:
                                item.material,

                            weight:
                                Number(
                                    item.weight
                                )

                        })
                }
            );


        const data =
            await response.json();


        if (
            !data.success ||
            !data.recyclers ||
            data.recyclers.length === 0
        ) {

            alert(
                "No verified recycler is available for this material."
            );

            return;
        }


        // Backend already sorts by best rate

        const bestRecycler =
            data.recyclers[0];


        const handoverId =
            "KH-" +
            new Date()
                .toISOString()
                .slice(0,10)
                .replaceAll("-", "") +
            "-" +
            String(
                handoverCounter++
            ).padStart(3, "0");


        const rate =
            Number(
                bestRecycler.rate
            ) || 0;


        const weight =
            Number(
                item.weight
            ) || 0;


        const value =
            Number(
                bestRecycler.estimated_value
            ) ||
            rate * weight;


        activeHandover = {

            id:
                handoverId,

            material:
                item.material,

            weight:
                weight,

            recycler:
                bestRecycler.name,

            recyclerRate:
                rate,

            value:
                value,

            distance:
                bestRecycler.distance,

            rating:
                bestRecycler.rating,

            status:
                "Pending Confirmation",

            createdAt:
                new Date().toLocaleString()

        };


        showHandoverDetails();

    } catch (error) {

        console.error(
            "Handover error:",
            error
        );


        alert(
            "Could not prepare handover: " +
            error.message
        );

    }

}


// =========================================================
// HANDOVER DETAILS MODAL
// =========================================================

function showHandoverDetails() {

    if (!activeHandover) {
        return;
    }


    const old =
        document.getElementById(
            "recyclerHandoverModal"
        );


    if (old) {
        old.remove();
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "recyclerHandoverModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.58);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:15000;
        padding:20px;
    `;


    modal.innerHTML = `

        <div style="
            width:min(520px,100%);
            max-height:90vh;
            overflow:auto;
            background:#fff;
            border-radius:22px;
            padding:28px;
            box-shadow:0 25px 70px rgba(0,0,0,.25);
        ">

            <div style="
                text-align:center;
                font-size:46px;
            ">
                📦
            </div>


            <h2 style="
                text-align:center;
                margin:8px 0 4px;
            ">
                Recycler Handover
            </h2>


            <p style="
                text-align:center;
                color:#6b7280;
                margin-top:0;
            ">
                Prepare this material for formal recycling.
            </p>


            <!-- MATERIAL -->

            <div style="
                background:#f8fafc;
                border-radius:14px;
                padding:16px;
                margin-top:20px;
            ">

                <div style="
                    font-size:12px;
                    color:#6b7280;
                ">
                    MATERIAL
                </div>

                <div style="
                    font-size:18px;
                    font-weight:800;
                    margin-top:4px;
                ">
                    ${activeHandover.material}
                </div>


                <div style="
                    margin-top:10px;
                    color:#6b7280;
                ">
                    Physical Weight:
                    <strong style="color:#111827;">
                        ${activeHandover.weight.toFixed(2)} kg
                    </strong>
                </div>

            </div>


            <!-- RECYCLER -->

            <div style="
                background:#f3fdf7;
                border:1px solid #bbf7d0;
                border-radius:14px;
                padding:16px;
                margin-top:14px;
            ">

                <div style="
                    font-size:12px;
                    color:#16803c;
                    font-weight:700;
                ">
                    🏆 BEST AUTHORIZED RECYCLER
                </div>


                <div style="
                    font-size:18px;
                    font-weight:800;
                    margin-top:5px;
                ">
                    ${activeHandover.recycler}
                </div>


                <div style="
                    margin-top:6px;
                    color:#6b7280;
                    font-size:13px;
                ">
                    📍 ${activeHandover.distance}
                    &nbsp; • &nbsp;
                    ⭐ ${activeHandover.rating}
                </div>


                <div style="
                    margin-top:12px;
                    font-size:20px;
                    font-weight:800;
                    color:#16803c;
                ">
                    ₹${activeHandover.recyclerRate}/kg
                </div>

            </div>


            <!-- VALUE -->

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:18px 4px;
                border-bottom:1px solid #e5e7eb;
            ">

                <span style="color:#6b7280;">
                    Expected recycler payout
                </span>

                <strong style="font-size:22px;">
                    ₹${activeHandover.value.toFixed(2)}
                </strong>

            </div>


            <!-- HANDOVER ID -->

            <div style="
                margin-top:18px;
                padding:14px;
                background:#f8fafc;
                border-radius:12px;
            ">

                <div style="
                    font-size:12px;
                    color:#6b7280;
                ">
                    HANDOVER ID
                </div>

                <strong>
                    ${activeHandover.id}
                </strong>

            </div>


            <!-- QR AREA -->

            <div
                id="handoverQR"
                style="
                    margin:20px auto;
                    width:180px;
                    height:180px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#f8fafc;
                    border-radius:14px;
                    color:#6b7280;
                    text-align:center;
                    font-size:13px;
                "
            >
                QR will be generated
            </div>


            <div style="
                text-align:center;
                font-size:12px;
                color:#6b7280;
                margin-bottom:20px;
            ">
                Scan this handover code to verify
                the recycling transfer.
            </div>


            <!-- BUTTONS -->

            <div style="
                display:flex;
                gap:10px;
            ">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeHandoverDetails()"
                    style="flex:1;"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="primary-btn"
                    onclick="generateHandoverQR()"
                    style="flex:1;"
                >
                    🔐 Generate QR
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


// =========================================================
// GENERATE HANDOVER QR
// =========================================================

function generateHandoverQR() {

    if (!activeHandover) {
        return;
    }


    const qrBox =
        document.getElementById(
            "handoverQR"
        );


    if (!qrBox) {
        return;
    }


    /*
        Demo QR representation.

        For the SIH prototype we keep the QR
        dependency-free. Production version can
        use a proper QR library.
    */

    const qrData = [
        "KABADI_SETU",
        activeHandover.id,
        activeHandover.material,
        activeHandover.weight + "kg",
        activeHandover.recycler,
        "PENDING"
    ].join("|");


    qrBox.innerHTML = `

        <div style="
            width:150px;
            height:150px;
            display:grid;
            grid-template-columns:repeat(10,1fr);
            gap:2px;
            padding:8px;
            background:#fff;
            border:1px solid #111827;
            box-sizing:border-box;
        ">

            ${
                createDemoQRPattern(
                    qrData
                )
            }

        </div>

    `;


    showToast(
        "Handover QR generated successfully."
    );


    const buttons =
        document.querySelectorAll(
            "#recyclerHandoverModal button"
        );


    if (buttons.length >= 2) {

        buttons[1].innerText =
            "✅ Confirm Recycler Receipt";

        buttons[1].onclick =
            confirmRecyclerReceipt;

    }

}


// =========================================================
// DEMO QR PATTERN
// =========================================================

function createDemoQRPattern(
    text
) {

    let seed = 0;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        seed =
            (
                seed * 31 +
                text.charCodeAt(i)
            ) %
            100000;

    }


    let html = "";


    for (
        let i = 0;
        i < 100;
        i++
    ) {

        seed =
            (
                seed * 1103515245 +
                12345
            ) &
            0x7fffffff;


        const filled =
            seed % 3 !== 0;


        html += `

            <div style="
                background:
                    ${filled ? "#111827" : "#ffffff"};
                min-width:0;
                min-height:0;
            "></div>

        `;

    }


    return html;

}


// =========================================================
// CONFIRM RECYCLER RECEIPT
// =========================================================

function confirmRecyclerReceipt() {

    if (!activeHandover) {
        return;
    }


    activeHandover.status =
        "Completed";


    activeHandover.completedAt =
        new Date().toLocaleString();


    // Add transaction

    const transaction = {

        id:
            activeHandover.id,

        material:
            activeHandover.material,

        weight:
            activeHandover.weight,

        recycler:
            activeHandover.recycler,

        amount:
            activeHandover.value,

        status:
            "Recycling Handover Complete",

        date:
            activeHandover.completedAt

    };


    collectorTransactions.unshift(
        transaction
    );


    // Remove corresponding inventory item

    const inventoryIndex =
        collectorInventory.findIndex(
            item =>
                item.material ===
                    activeHandover.material &&
                Number(item.weight) ===
                    Number(activeHandover.weight)
        );


    if (inventoryIndex !== -1) {

        collectorInventory.splice(
            inventoryIndex,
            1
        );

    }


    closeHandoverDetails();


    renderCollectorDashboard();

    renderCollectorTransactions();


    showHandoverSuccess(
        transaction
    );

}


// =========================================================
// HANDOVER SUCCESS
// =========================================================

function showHandoverSuccess(
    transaction
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "handoverSuccessModal";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:16000;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div style="
            width:min(450px,100%);
            background:#fff;
            border-radius:22px;
            padding:30px;
            text-align:center;
            box-shadow:0 25px 70px rgba(0,0,0,.25);
        ">

            <div style="
                font-size:60px;
            ">
                ♻️
            </div>


            <h2>
                Handover Completed!
            </h2>


            <p style="
                color:#6b7280;
            ">
                The collected material has been
                formally handed over to the recycler.
            </p>


            <div style="
                background:#f3fdf7;
                border-radius:14px;
                padding:18px;
                margin:20px 0;
                text-align:left;
            ">

                <div>
                    <strong>
                        Material:
                    </strong>

                    ${transaction.material}
                </div>


                <div style="margin-top:8px;">
                    <strong>
                        Weight:
                    </strong>

                    ${transaction.weight.toFixed(2)}
                    kg
                </div>


                <div style="margin-top:8px;">
                    <strong>
                        Recycler:
                    </strong>

                    ${transaction.recycler}
                </div>


                <div style="margin-top:8px;">
                    <strong>
                        Recycler Payout:
                    </strong>

                    ₹${transaction.amount.toFixed(2)}
                </div>

            </div>


            <div style="
                background:#f8fafc;
                padding:12px;
                border-radius:10px;
                font-size:13px;
            ">

                Handover ID:

                <strong>
                    ${transaction.id}
                </strong>

            </div>


            <button
                type="button"
                class="primary-btn"
                onclick="closeHandoverSuccess()"
                style="
                    margin-top:20px;
                    width:100%;
                "
            >
                Done
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// =========================================================
// CLOSE HANDOVER DETAILS
// =========================================================

function closeHandoverDetails() {

    const modal =
        document.getElementById(
            "recyclerHandoverModal"
        );


    if (modal) {
        modal.remove();
    }

    activeHandover =
        null;

}


// =========================================================
// CLOSE SUCCESS
// =========================================================

function closeHandoverSuccess() {

    const modal =
        document.getElementById(
            "handoverSuccessModal"
        );


    if (modal) {
        modal.remove();
    }

}
// ============================================================
// FIND BEST RECYCLER FROM COLLECTION SUCCESS POPUP
// ============================================================

window.openRecyclerForCollected = function (material, weight) {

    console.log("Opening recycler for:", material, weight);

    // Close the Collection Completed popup
    document.querySelectorAll("body > div").forEach(function (element) {

        const style = window.getComputedStyle(element);

        if (
            style.position === "fixed" ||
            element.style.position === "fixed"
        ) {
            element.remove();
        }

    });

    // Get recycler controls
    const recyclerMaterial =
        document.getElementById("recyclerMaterial");

    const recyclerWeight =
        document.getElementById("recyclerWeight");

    // Set material
    if (recyclerMaterial) {

        const option = Array.from(
            recyclerMaterial.options
        ).find(function (option) {
            return option.value === material;
        });

        if (option) {
            recyclerMaterial.value = material;
        }

    }

    // Set actual collected weight
    if (recyclerWeight) {
        recyclerWeight.value = Number(weight).toFixed(2);
    }

    // Open Recycler Network section
    if (typeof showSection === "function") {

        showSection("recyclers");

    } else {

        // Fallback if showSection is unavailable
        document.querySelectorAll(".page-section").forEach(
            function (section) {
                section.classList.remove("active-section");
            }
        );

        const recyclerSection =
            document.getElementById("recyclers");

        if (recyclerSection) {
            recyclerSection.classList.add("active-section");
        }

    }

    // Load live recycler rates
    setTimeout(function () {

        if (typeof loadRecyclerRates === "function") {

            loadRecyclerRates();

        } else {

            console.error(
                "loadRecyclerRates() is not available."
            );

            alert(
                "Recycler service is not available. Please refresh the page."
            );

        }

    }, 150);

};

// ============================================================
// FIND BEST RECYCLER - COMPLETE WORKING FUNCTION
// ============================================================

window.openRecyclerForCollected = async function (material, weight) {

    console.log("=================================");
    console.log("FIND BEST RECYCLER");
    console.log("Material:", material);
    console.log("Weight:", weight);
    console.log("=================================");

    // --------------------------------------------------------
    // 1. CLOSE COLLECTION COMPLETED POPUP
    // --------------------------------------------------------

    document.querySelectorAll("body > div").forEach(function (element) {

        const computedStyle =
            window.getComputedStyle(element);

        if (
            computedStyle.position === "fixed" ||
            element.style.position === "fixed"
        ) {
            element.remove();
        }

    });


    // --------------------------------------------------------
    // 2. GET RECYCLER PAGE ELEMENTS
    // --------------------------------------------------------

    const recyclerSection =
        document.getElementById("recyclers");

    const materialSelect =
        document.getElementById("recyclerMaterial");

    const weightInput =
        document.getElementById("recyclerWeight");

    const resultsBox =
        document.getElementById("recyclerResults");


    if (!recyclerSection) {

        alert(
            "Recycler Network section could not be found."
        );

        console.error(
            "Element #recyclers not found"
        );

        return;
    }


    if (!materialSelect) {

        alert(
            "Recycler material selector could not be found."
        );

        console.error(
            "Element #recyclerMaterial not found"
        );

        return;
    }


    if (!weightInput) {

        alert(
            "Recycler weight field could not be found."
        );

        console.error(
            "Element #recyclerWeight not found"
        );

        return;
    }


    // --------------------------------------------------------
    // 3. SET MATERIAL
    // --------------------------------------------------------

    const materialOption =
        Array.from(
            materialSelect.options
        ).find(function (option) {

            return option.value === material;

        });


    if (materialOption) {

        materialSelect.value =
            material;

    } else {

        console.warn(
            "Material not found in recycler dropdown:",
            material
        );

    }


    // --------------------------------------------------------
    // 4. SET ACTUAL COLLECTED WEIGHT
    // --------------------------------------------------------

    weightInput.value =
        Number(weight).toFixed(2);


    // --------------------------------------------------------
    // 5. OPEN RECYCLER NETWORK
    // --------------------------------------------------------

    if (
        typeof showSection ===
        "function"
    ) {

        showSection("recyclers");

    } else {

        // Fallback navigation
        document.querySelectorAll(
            ".page-section"
        ).forEach(function (section) {

            section.classList.remove(
                "active-section"
            );

        });


        recyclerSection.classList.add(
            "active-section"
        );

    }


    // --------------------------------------------------------
    // 6. SHOW LOADING STATE
    // --------------------------------------------------------

    if (resultsBox) {

        resultsBox.innerHTML = `
            <div
                style="
                    padding:30px;
                    text-align:center;
                    color:#6b7280;
                "
            >

                <div
                    style="
                        font-size:32px;
                        margin-bottom:10px;
                    "
                >
                    🔎
                </div>

                <strong>
                    Finding best recycler...
                </strong>

                <p
                    style="
                        margin-top:6px;
                        font-size:13px;
                    "
                >
                    Comparing verified recycler rates
                    for ${material}.
                </p>

            </div>
        `;

    }


    // --------------------------------------------------------
    // 7. CALL RECYCLER API DIRECTLY
    // --------------------------------------------------------

    try {

        const response =
            await fetch(
                "/recyclers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        material:
                            material,

                        weight:
                            Number(weight)

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Recycler server returned an error."
            );

        }


        const data =
            await response.json();


        console.log(
            "Recycler API response:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.error ||
                "Unable to find recycler rates."
            );

        }


        // ----------------------------------------------------
        // 8. DISPLAY RESULTS
        // ----------------------------------------------------

        if (!resultsBox) {
            return;
        }


        resultsBox.innerHTML = "";


        if (
            !data.recyclers ||
            data.recyclers.length === 0
        ) {

            resultsBox.innerHTML = `

                <div
                    style="
                        padding:30px;
                        text-align:center;
                    "
                >

                    <div style="font-size:35px;">
                        ♻️
                    </div>

                    <h3>
                        No recycler offers found
                    </h3>

                    <p>
                        No verified recycler is currently
                        available for this material.
                    </p>

                </div>

            `;

            return;
        }


        // ----------------------------------------------------
        // 9. SORT HIGHEST RATE FIRST
        // ----------------------------------------------------

        data.recyclers.sort(
            function (a, b) {

                return Number(b.rate) -
                       Number(a.rate);

            }
        );


        // ----------------------------------------------------
        // 10. CREATE RECYCLER CARDS
        // ----------------------------------------------------

        data.recyclers.forEach(
            function (recycler, index) {

                const card =
                    document.createElement("div");


                card.className =
                    "recycler-card";


                const isBest =
                    index === 0;


                const pickupText =
                    recycler.pickup
                        ? "🚚 Pickup available"
                        : "📍 Drop-off";


                card.innerHTML = `

                    <div class="recycler-info">

                        <div
                            class="recycler-title"
                        >

                            <h3>
                                ${recycler.name}
                            </h3>

                            ${
                                isBest
                                ?
                                `
                                <span
                                    class="best-badge"
                                >
                                    🏆 BEST PRICE
                                </span>
                                `
                                :
                                ""
                            }

                        </div>


                        <p>
                            📍 ${recycler.distance}
                            &nbsp; • &nbsp;
                            ⭐ ${recycler.rating}
                        </p>


                        <small>

                            ✓ ${recycler.authorization}

                            &nbsp; • &nbsp;

                            ${pickupText}

                        </small>

                    </div>


                    <div
                        class="recycler-price"
                    >

                        <span>
                            Recycler Rate
                        </span>

                        <strong>
                            ₹${Number(
                                recycler.rate
                            ).toFixed(0)}/kg
                        </strong>

                        <small>
                            Estimated value:
                            ₹${Number(
                                recycler.estimated_value
                            ).toFixed(2)}
                        </small>

                    </div>

                `;


                // Highlight best recycler
                if (isBest) {

                    card.style.border =
                        "2px solid #159570";

                    card.style.boxShadow =
                        "0 8px 25px rgba(21,149,112,0.12)";

                }


                resultsBox.appendChild(card);

            }
        );


        // ----------------------------------------------------
        // 11. SUCCESS MESSAGE
        // ----------------------------------------------------

        const bestRecycler =
            data.recyclers[0];


        const bestMessage =
            document.createElement("div");


        bestMessage.style.cssText = `
            margin-top:20px;
            padding:18px;
            border-radius:14px;
            background:#ecfdf5;
            border:1px solid #bbf7d0;
        `;


        bestMessage.innerHTML = `

            <strong
                style="
                    color:#087f5b;
                    font-size:16px;
                "
            >
                🏆 Best Recycler Found
            </strong>

            <div
                style="
                    margin-top:8px;
                    font-size:14px;
                "
            >

                <strong>
                    ${bestRecycler.name}
                </strong>

                <br>

                Best rate:
                <strong>
                    ₹${Number(
                        bestRecycler.rate
                    ).toFixed(0)}/kg
                </strong>

                <br>

                Your ${Number(weight).toFixed(2)} kg
                material is worth approximately

                <strong>
                    ₹${Number(
                        bestRecycler.estimated_value
                    ).toFixed(2)}
                </strong>

            </div>

        `;


        resultsBox.appendChild(
            bestMessage
        );


        console.log(
            "Best recycler:",
            bestRecycler.name
        );


    } catch (error) {

        console.error(
            "Recycler lookup failed:",
            error
        );


        if (resultsBox) {

            resultsBox.innerHTML = `

                <div
                    style="
                        padding:25px;
                        text-align:center;
                        color:#b91c1c;
                    "
                >

                    <div
                        style="
                            font-size:30px;
                        "
                    >
                        ⚠️
                    </div>

                    <h3>
                        Could not load recycler offers
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                    <button
                        type="button"
                        class="primary-btn"
                        onclick="
                            window.openRecyclerForCollected(
                                '${material}',
                                ${Number(weight)}
                            )
                        "
                        style="
                            margin-top:12px;
                        "
                    >
                        Try Again
                    </button>

                </div>

            `;

        }

    }

};

// ============================================================
// RECYCLER HANDOVER SYSTEM
// ============================================================

let selectedRecycler = null;


// ============================================================
// RECYCLER RATE COMPARISON
// ============================================================

async function loadRecyclerRates() {

    const materialElement =
        document.getElementById("recyclerMaterial");

    const weightElement =
        document.getElementById("recyclerWeight");

    const container =
        document.getElementById("recyclerResults");

    if (!materialElement ||
        !weightElement ||
        !container) {

        console.error("Recycler elements not found.");
        return;
    }

    const material =
        materialElement.value;

    const weight =
        Number(weightElement.value);

    if (!material) {

        alert("Please select a material.");
        return;

    }

    if (!weight || weight <= 0) {

        alert("Please enter a valid weight.");
        return;

    }

    container.innerHTML = `

        <div style="
            text-align:center;
            padding:35px;
            color:#6b7280;
        ">

            <div style="
                font-size:35px;
                margin-bottom:10px;
            ">
                🔎
            </div>

            <strong>
                Finding best recycler...
            </strong>

            <p>
                Comparing verified recycler rates.
            </p>

        </div>

    `;


    try {

        const response =
            await fetch("/recyclers", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    material: material,
                    weight: weight

                })

            });


        const data =
            await response.json();


        if (!response.ok ||
            !data.success) {

            throw new Error(
                data.error ||
                "Could not load recycler rates."
            );

        }


        const recyclers =
            data.recyclers || [];


        if (recyclers.length === 0) {

            container.innerHTML = `

                <div style="
                    padding:35px;
                    text-align:center;
                ">

                    <div style="
                        font-size:40px;
                    ">
                        ♻️
                    </div>

                    <h3>
                        No recyclers found
                    </h3>

                    <p>
                        No verified recycler offers
                        are available for this material.
                    </p>

                </div>

            `;

            return;

        }


        // Highest rate first
        recyclers.sort(
            (a, b) =>
                Number(b.rate) -
                Number(a.rate)
        );


        container.innerHTML = "";


        recyclers.forEach(
            function(recycler, index) {

                const card =
                    document.createElement("div");

                card.className =
                    "recycler-card";


                const best =
                    index === 0;


                const estimatedValue =
                    Number(
                        recycler.estimated_value
                    );


                card.innerHTML = `

                    <div class="recycler-info">

                        <div
                            class="recycler-title"
                        >

                            <h3>
                                ${recycler.name}
                            </h3>

                            ${
                                best
                                ?
                                `
                                <span
                                    class="best-badge"
                                >
                                    🏆 BEST PRICE
                                </span>
                                `
                                :
                                ""
                            }

                        </div>


                        <p>
                            📍 ${recycler.distance}
                            &nbsp; • &nbsp;
                            ⭐ ${recycler.rating}
                        </p>


                        <small>

                            ✓ ${recycler.authorization}

                            &nbsp; • &nbsp;

                            ${
                                recycler.pickup
                                ?
                                "🚚 Pickup available"
                                :
                                "📍 Drop-off"
                            }

                        </small>

                    </div>


                    <div
                        class="recycler-price"
                    >

                        <span>
                            Recycler Rate
                        </span>

                        <strong>
                            ₹${Number(
                                recycler.rate
                            ).toFixed(0)}/kg
                        </strong>

                        <small>
                            Estimated value:
                            ₹${estimatedValue.toFixed(2)}
                        </small>

                    </div>


                    <div
                        style="
                            margin-top:15px;
                        "
                    >

                        <button
                            type="button"
                            onclick="
                                selectRecyclerForHandover(
                                    ${index}
                                )
                            "
                            style="
                                width:100%;
                                border:none;
                                border-radius:10px;
                                padding:12px;
                                background:${
                                    best
                                    ? "#159570"
                                    : "#111827"
                                };
                                color:white;
                                font-weight:700;
                                cursor:pointer;
                                font-size:14px;
                            "
                        >

                            ${
                                best
                                ?
                                "🏆 Select Best Recycler"
                                :
                                "Select Recycler"
                            }

                        </button>

                    </div>

                `;


                if (best) {

                    card.style.border =
                        "2px solid #159570";

                    card.style.boxShadow =
                        "0 8px 25px rgba(21,149,112,0.12)";

                }


                container.appendChild(card);

            }
        );


    } catch (error) {

        console.error(
            "Recycler lookup failed:",
            error
        );


        container.innerHTML = `

            <div style="
                padding:30px;
                text-align:center;
                color:#b91c1c;
            ">

                <div style="
                    font-size:35px;
                ">
                    ⚠️
                </div>

                <h3>
                    Could not load recycler offers
                </h3>

                <p>
                    ${error.message}
                </p>

                <button
                    type="button"
                    onclick="loadRecyclerRates()"
                    style="
                        margin-top:10px;
                        padding:11px 18px;
                        border:none;
                        border-radius:9px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// ============================================================
// SELECT RECYCLER
// ============================================================

window.selectRecyclerForHandover =
    async function(index) {

        const materialElement =
            document.getElementById(
                "recyclerMaterial"
            );

        const weightElement =
            document.getElementById(
                "recyclerWeight"
            );

        if (!materialElement ||
            !weightElement) {

            alert(
                "Recycler information is missing."
            );

            return;

        }


        const material =
            materialElement.value;

        const weight =
            Number(weightElement.value);


        if (!material ||
            !weight ||
            weight <= 0) {

            alert(
                "Please enter material and weight first."
            );

            return;

        }


        try {

            const response =
                await fetch("/recyclers", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        material: material,
                        weight: weight

                    })

                });


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.error ||
                    "Unable to select recycler."
                );

            }


            const recyclers =
                data.recyclers || [];


            recyclers.sort(
                (a, b) =>
                    Number(b.rate) -
                    Number(a.rate)
            );


            const recycler =
                recyclers[index];


            if (!recycler) {

                alert(
                    "Recycler could not be selected."
                );

                return;

            }


            selectedRecycler = recycler;


            activeHandover = {

                material:
                    material,

                weight:
                    weight,

                recycler:
                    recycler,

                createdAt:
                    new Date()

            };


            showRecyclerSelectionModal();

        } catch (error) {

            console.error(
                error
            );

            alert(
                "Could not select recycler:\n\n" +
                error.message
            );

        }

    };


// ============================================================
// RECYCLER SELECTION MODAL
// ============================================================

function showRecyclerSelectionModal() {

    if (!activeHandover ||
        !activeHandover.recycler) {

        return;

    }


    const recycler =
        activeHandover.recycler;


    const old =
        document.getElementById(
            "recyclerSelectionModal"
        );


    if (old) {
        old.remove();
    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "recyclerSelectionModal";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div
            style="
                background:white;
                width:min(520px,100%);
                border-radius:20px;
                padding:28px;
                box-shadow:0 20px 60px rgba(0,0,0,0.2);
            "
        >

            <div
                style="
                    text-align:center;
                    font-size:42px;
                "
            >
                🏆
            </div>


            <h2
                style="
                    text-align:center;
                    margin:8px 0;
                "
            >
                Recycler Selected
            </h2>


            <p
                style="
                    text-align:center;
                    color:#6b7280;
                "
            >
                You selected the following recycler
                for your collected material.
            </p>


            <div
                style="
                    margin-top:20px;
                    padding:18px;
                    border-radius:14px;
                    background:#f0fdf4;
                    border:1px solid #bbf7d0;
                "
            >

                <strong
                    style="
                        font-size:18px;
                    "
                >
                    ${recycler.name}
                </strong>


                <div
                    style="
                        margin-top:10px;
                        line-height:1.8;
                    "
                >

                    📦 Material:
                    <strong>
                        ${activeHandover.material}
                    </strong>

                    <br>

                    ⚖️ Weight:
                    <strong>
                        ${Number(
                            activeHandover.weight
                        ).toFixed(2)} kg
                    </strong>

                    <br>

                    💰 Rate:
                    <strong>
                        ₹${Number(
                            recycler.rate
                        ).toFixed(0)}/kg
                    </strong>

                    <br>

                    💵 Estimated value:
                    <strong>
                        ₹${Number(
                            recycler.estimated_value
                        ).toFixed(2)}
                    </strong>

                </div>

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-top:22px;
                "
            >

                <button
                    type="button"
                    onclick="closeRecyclerSelectionModal()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#e5e7eb;
                        color:#374151;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Cancel
                </button>


                <button
                    type="button"
                    onclick="prepareRecyclerHandover()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    📦 Prepare Handover
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// ============================================================
// CLOSE SELECTION MODAL
// ============================================================

window.closeRecyclerSelectionModal =
    function() {

        const modal =
            document.getElementById(
                "recyclerSelectionModal"
            );

        if (modal) {
            modal.remove();
        }

    };


// ============================================================
// PREPARE HANDOVER
// ============================================================

window.prepareRecyclerHandover =
    function() {

        if (!activeHandover ||
            !activeHandover.recycler) {

            alert(
                "Please select a recycler first."
            );

            return;

        }


        closeRecyclerSelectionModal();


        showHandoverDetails();

    };


// ============================================================
// SHOW HANDOVER DETAILS
// ============================================================

function showHandoverDetails() {

    const old =
        document.getElementById(
            "handoverDetailsModal"
        );


    if (old) {
        old.remove();
    }


    const recycler =
        activeHandover.recycler;


    const handoverId =
        "HS-" +
        Date.now().toString().slice(-8);


    activeHandover.handoverId =
        handoverId;


    const overlay =
        document.createElement("div");


    overlay.id =
        "handoverDetailsModal";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div
            style="
                background:white;
                width:min(560px,100%);
                max-height:90vh;
                overflow:auto;
                border-radius:20px;
                padding:28px;
            "
        >

            <div
                style="
                    text-align:center;
                    font-size:45px;
                "
            >
                📦
            </div>


            <h2
                style="
                    text-align:center;
                    margin:8px 0;
                "
            >
                Prepare Recycler Handover
            </h2>


            <p
                style="
                    text-align:center;
                    color:#6b7280;
                "
            >
                Verify the handover details before
                generating the handover token.
            </p>


            <div
                style="
                    margin-top:20px;
                    padding:18px;
                    border-radius:14px;
                    background:#f8fafc;
                    border:1px solid #e5e7eb;
                    line-height:1.9;
                "
            >

                <strong>
                    Recycler
                </strong>

                <br>

                ${recycler.name}

                <hr
                    style="
                        border:none;
                        border-top:1px solid #e5e7eb;
                        margin:12px 0;
                    "
                >

                <strong>
                    Material
                </strong>

                <br>

                ${activeHandover.material}

                <br><br>

                <strong>
                    Physical Weight
                </strong>

                <br>

                ${Number(
                    activeHandover.weight
                ).toFixed(2)} kg

                <br><br>

                <strong>
                    Recycler Rate
                </strong>

                <br>

                ₹${Number(
                    recycler.rate
                ).toFixed(0)}/kg

                <br><br>

                <strong>
                    Expected Recycler Value
                </strong>

                <br>

                ₹${Number(
                    recycler.estimated_value
                ).toFixed(2)}

            </div>


            <div
                style="
                    margin-top:15px;
                    padding:14px;
                    background:#fff7ed;
                    border-radius:12px;
                    font-size:13px;
                "
            >

                ⚠️ The recycler should verify the
                physical material and weight before
                confirming receipt.

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-top:20px;
                "
            >

                <button
                    type="button"
                    onclick="closeHandoverDetails()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#e5e7eb;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Cancel
                </button>


                <button
                    type="button"
                    onclick="generateHandoverQR()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    🔐 Generate Handover QR
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// ============================================================
// CLOSE HANDOVER DETAILS
// ============================================================

window.closeHandoverDetails =
    function() {

        const modal =
            document.getElementById(
                "handoverDetailsModal"
            );

        if (modal) {
            modal.remove();
        }

    };


// ============================================================
// GENERATE HANDOVER QR / TOKEN
// ============================================================

window.generateHandoverQR =
    function() {

        if (!activeHandover) {

            alert(
                "No active handover found."
            );

            return;

        }


        closeHandoverDetails();


        const old =
            document.getElementById(
                "handoverQRModal"
            );


        if (old) {
            old.remove();
        }


        const token =
            "KSETU-" +
            Date.now().toString(36).toUpperCase();


        activeHandover.token =
            token;


        const overlay =
            document.createElement("div");


        overlay.id =
            "handoverQRModal";


        overlay.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.6);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        `;


        overlay.innerHTML = `

            <div
                style="
                    background:white;
                    width:min(500px,100%);
                    border-radius:20px;
                    padding:28px;
                    text-align:center;
                "
            >

                <div
                    style="
                        font-size:42px;
                    "
                >
                    🔐
                </div>


                <h2>
                    Handover QR Generated
                </h2>


                <p
                    style="
                        color:#6b7280;
                    "
                >
                    Show this handover token to the
                    selected recycler.
                </p>


                <div
                    style="
                        margin:20px auto;
                        width:220px;
                        height:220px;
                        border-radius:14px;
                        background:
                            repeating-linear-gradient(
                                45deg,
                                #111827 0px,
                                #111827 4px,
                                white 4px,
                                white 8px
                            );
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border:12px solid white;
                        box-shadow:
                            0 0 0 1px #d1d5db;
                    "
                >

                    <div
                        style="
                            background:white;
                            padding:14px;
                            border-radius:8px;
                            font-weight:800;
                            font-size:11px;
                        "
                    >
                        KABADI<br>
                        SETU
                    </div>

                </div>


                <div
                    style="
                        background:#f0fdf4;
                        padding:15px;
                        border-radius:12px;
                        margin-top:15px;
                    "
                >

                    <small>
                        Handover ID
                    </small>

                    <br>

                    <strong>
                        ${activeHandover.handoverId}
                    </strong>

                    <br><br>

                    <small>
                        Secure Token
                    </small>

                    <br>

                    <strong>
                        ${token}
                    </strong>

                </div>


                <button
                    type="button"
                    onclick="confirmRecyclerReceipt()"
                    style="
                        width:100%;
                        margin-top:18px;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    ✅ Recycler Confirms Receipt
                </button>


                <button
                    type="button"
                    onclick="closeHandoverQR()"
                    style="
                        width:100%;
                        margin-top:10px;
                        padding:12px;
                        border:none;
                        border-radius:10px;
                        background:#e5e7eb;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Close
                </button>

            </div>

        `;


        document.body.appendChild(
            overlay
        );

    };


// ============================================================
// CLOSE QR
// ============================================================

window.closeHandoverQR =
    function() {

        const modal =
            document.getElementById(
                "handoverQRModal"
            );

        if (modal) {
            modal.remove();
        }

    };


// ============================================================
// RECYCLER CONFIRMS RECEIPT
// ============================================================

window.confirmRecyclerReceipt =
    function() {

        if (!activeHandover) {

            alert(
                "No active handover."
            );

            return;

        }


        const recycler =
            activeHandover.recycler;


        const amount =
            Number(
                recycler.rate
            ) *
            Number(
                activeHandover.weight
            );


        const transactionId =
            "TX-" +
            new Date()
                .toISOString()
                .replace(/\D/g, "")
                .slice(0, 14);


        activeHandover.transactionId =
            transactionId;

        activeHandover.finalAmount =
            amount;

        activeHandover.status =
            "Completed";


        // Remove QR modal
        closeHandoverQR();


        // Remove item from collector inventory
        if (
            typeof collectorInventory !==
            "undefined"
        ) {

            const index =
                collectorInventory.findIndex(
                    function(item) {

                        return (
                            item.material ===
                                activeHandover.material
                            &&
                            Number(item.weight) ===
                                Number(activeHandover.weight)
                        );

                    }
                );


            if (index !== -1) {

                collectorInventory.splice(
                    index,
                    1
                );

            }

        }


        // Add transaction
        if (
            typeof collectorTransactions !==
            "undefined"
        ) {

            collectorTransactions.unshift({

                id:
                    transactionId,

                type:
                    "Recycler Handover",

                material:
                    activeHandover.material,

                weight:
                    activeHandover.weight,

                recycler:
                    recycler.name,

                rate:
                    recycler.rate,

                amount:
                    amount,

                status:
                    "Completed",

                date:
                    new Date().toLocaleString()

            });

        }


        // Update earnings
        if (
            typeof collectorEarnings !==
            "undefined"
        ) {

            collectorEarnings +=
                amount;

        }


        // Refresh collector dashboard
        if (
            typeof renderCollectorDashboard ===
            "function"
        ) {

            renderCollectorDashboard();

        }


        showHandoverSuccess();

    };


// ============================================================
// HANDOVER SUCCESS
// ============================================================

function showHandoverSuccess() {

    const recycler =
        activeHandover.recycler;


    const overlay =
        document.createElement("div");


    overlay.id =
        "handoverSuccessModal";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div
            style="
                background:white;
                width:min(520px,100%);
                border-radius:20px;
                padding:30px;
                text-align:center;
            "
        >

            <div
                style="
                    font-size:55px;
                "
            >
                ✅
            </div>


            <h2>
                Recycler Handover Completed
            </h2>


            <p
                style="
                    color:#6b7280;
                "
            >
                The material has been successfully
                handed over to the recycler.
            </p>


            <div
                style="
                    margin:20px 0;
                    padding:20px;
                    border-radius:14px;
                    background:#f0fdf4;
                "
            >

                <small>
                    Recycler
                </small>

                <br>

                <strong>
                    ${recycler.name}
                </strong>

                <br><br>

                <small>
                    Material
                </small>

                <br>

                <strong>
                    ${activeHandover.material}
                </strong>

                <br><br>

                <small>
                    Weight
                </small>

                <br>

                <strong>
                    ${Number(
                        activeHandover.weight
                    ).toFixed(2)} kg
                </strong>

                <br><br>

                <small>
                    Recycler Payment
                </small>

                <br>

                <strong
                    style="
                        font-size:28px;
                        color:#087f5b;
                    "
                >
                    ₹${Number(
                        activeHandover.finalAmount
                    ).toFixed(2)}
                </strong>

            </div>


            <div
                style="
                    padding:12px;
                    background:#f8fafc;
                    border-radius:10px;
                    font-size:13px;
                "
            >

                Transaction ID:
                <strong>
                    ${activeHandover.transactionId}
                </strong>

            </div>


            <button
                type="button"
                onclick="closeHandoverSuccess()"
                style="
                    width:100%;
                    margin-top:20px;
                    padding:14px;
                    border:none;
                    border-radius:10px;
                    background:#159570;
                    color:white;
                    font-weight:700;
                    cursor:pointer;
                "
            >
                Done
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// ============================================================
// CLOSE SUCCESS
// ============================================================

window.closeHandoverSuccess =
    function() {

        const modal =
            document.getElementById(
                "handoverSuccessModal"
            );

        if (modal) {
            modal.remove();
        }


        activeHandover =
            null;

        selectedRecycler =
            null;

    };
    // ============================================================
// VERIFIED COLLECTOR DIGITAL ID
// ============================================================

window.showCollectorDigitalID = function(request) {

    // Remove old modal if it exists
    const oldModal =
        document.getElementById("collectorDigitalIDModal");

    if (oldModal) {
        oldModal.remove();
    }

    // Demo collector profile
    const collector = {
        name: "Rajesh Kumar",
        id: "KS-COL-10284",
        rating: 4.7,
        collections: 184,
        phone: "+91 98XXXXXX42",
        verified: true,
        materials: [
            "Plastic",
            "Metal",
            "Paper",
            "E-Waste"
        ]
    };

    const modal =
        document.createElement("div");

    modal.id =
        "collectorDigitalIDModal";

    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        padding: 20px;
    `;

    modal.innerHTML = `

        <div style="
            background:#ffffff;
            width:min(500px,100%);
            border-radius:22px;
            padding:28px;
            box-shadow:0 25px 70px rgba(0,0,0,0.25);
        ">

            <!-- HEADER -->

            <div style="
                text-align:center;
            ">

                <div style="
                    width:78px;
                    height:78px;
                    margin:0 auto;
                    border-radius:50%;
                    background:#e8f7f1;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:38px;
                ">
                    👤
                </div>

                <h2 style="
                    margin:14px 0 4px;
                    color:#111827;
                ">
                    Verified Collector
                </h2>

                <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:14px;
                ">
                    Your pickup has been accepted
                </p>

            </div>


            <!-- VERIFIED BADGE -->

            <div style="
                margin-top:20px;
                text-align:center;
            ">

                <span style="
                    display:inline-block;
                    padding:7px 14px;
                    border-radius:20px;
                    background:#dcfce7;
                    color:#15803d;
                    font-size:13px;
                    font-weight:700;
                ">
                    ✓ VERIFIED COLLECTOR
                </span>

            </div>


            <!-- COLLECTOR DETAILS -->

            <div style="
                margin-top:20px;
                padding:20px;
                border-radius:16px;
                background:#f8fafc;
                border:1px solid #e5e7eb;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                ">

                    <div>

                        <div style="
                            font-size:20px;
                            font-weight:800;
                            color:#111827;
                        ">
                            ${collector.name}
                        </div>

                        <div style="
                            margin-top:5px;
                            font-size:13px;
                            color:#6b7280;
                        ">
                            Collector ID:
                            <strong>
                                ${collector.id}
                            </strong>
                        </div>

                    </div>


                    <div style="
                        width:70px;
                        height:70px;
                        border-radius:10px;
                        background:
                            repeating-linear-gradient(
                                45deg,
                                #111827 0px,
                                #111827 4px,
                                #ffffff 4px,
                                #ffffff 8px
                            );
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border:6px solid #ffffff;
                        box-shadow:
                            0 0 0 1px #d1d5db;
                    ">

                        <div style="
                            background:white;
                            padding:5px;
                            border-radius:4px;
                            font-size:8px;
                            font-weight:800;
                        ">
                            KS
                        </div>

                    </div>

                </div>


                <!-- STATS -->

                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(2,1fr);
                    gap:10px;
                    margin-top:18px;
                ">

                    <div style="
                        background:#ffffff;
                        padding:13px;
                        border-radius:12px;
                        text-align:center;
                    ">

                        <div style="
                            font-size:20px;
                            font-weight:800;
                        ">
                            ⭐ ${collector.rating}
                        </div>

                        <small style="
                            color:#6b7280;
                        ">
                            Rating
                        </small>

                    </div>


                    <div style="
                        background:#ffffff;
                        padding:13px;
                        border-radius:12px;
                        text-align:center;
                    ">

                        <div style="
                            font-size:20px;
                            font-weight:800;
                        ">
                            📦 ${collector.collections}
                        </div>

                        <small style="
                            color:#6b7280;
                        ">
                            Collections
                        </small>

                    </div>

                </div>


                <!-- MATERIALS -->

                <div style="
                    margin-top:18px;
                ">

                    <div style="
                        font-size:13px;
                        font-weight:700;
                        color:#374151;
                        margin-bottom:9px;
                    ">
                        Materials handled
                    </div>


                    <div style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:7px;
                    ">

                        ${collector.materials.map(
                            function(material) {

                                return `
                                    <span style="
                                        padding:7px 10px;
                                        background:#ecfdf5;
                                        color:#087f5b;
                                        border-radius:20px;
                                        font-size:12px;
                                        font-weight:600;
                                    ">
                                        ♻️ ${material}
                                    </span>
                                `;

                            }
                        ).join("")}

                    </div>

                </div>

            </div>


            <!-- REQUEST INFORMATION -->

            <div style="
                margin-top:14px;
                padding:14px;
                border-radius:12px;
                background:#f0fdf4;
                border:1px solid #bbf7d0;
                font-size:13px;
                line-height:1.7;
            ">

                <strong>
                    Pickup Request
                </strong>

                <br>

                📦 ${request.material}

                <br>

                ⚖️ Estimated weight:
                ${request.weight} kg

                <br>

                📍 ${request.address}

            </div>


            <!-- ACTIONS -->

            <div style="
                display:flex;
                gap:10px;
                margin-top:20px;
            ">

                <button
                    type="button"
                    onclick="closeCollectorDigitalID()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#e5e7eb;
                        color:#374151;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Close
                </button>


                <button
                    type="button"
                    onclick="continueAfterCollectorVerification()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Continue →
                </button>

            </div>


            <div style="
                text-align:center;
                margin-top:12px;
                font-size:11px;
                color:#9ca3af;
            ">
                Kabadi Setu verified collector network
            </div>

        </div>

    `;

    document.body.appendChild(modal);
};


// ============================================================
// CLOSE COLLECTOR DIGITAL ID
// ============================================================

window.closeCollectorDigitalID = function() {

    const modal =
        document.getElementById(
            "collectorDigitalIDModal"
        );

    if (modal) {
        modal.remove();
    }

};


// ============================================================
// CONTINUE AFTER COLLECTOR VERIFICATION
// ============================================================

window.continueAfterCollectorVerification =
    function() {

        if (!window.activeCollectorRequest &&
            typeof activeCollectorRequest === "undefined") {

            closeCollectorDigitalID();

            alert(
                "Collector request information is missing."
            );

            return;
        }


        const request =
            window.activeCollectorRequest ||
            activeCollectorRequest;


        closeCollectorDigitalID();


        // Open the existing physical weighing screen
        if (
            typeof showCollectorWeightModal ===
            "function"
        ) {

            showCollectorWeightModal(request);

        } else {

            alert(
                "Collection weighing screen could not be opened."
            );

            console.error(
                "showCollectorWeightModal() not found."
            );

        }

    };


// ============================================================
// ACCEPT PICKUP WITH COLLECTOR VERIFICATION
// ============================================================

window.acceptCollectorRequest =
    function(requestId) {

        const request =
            collectorRequests.find(
                function(item) {

                    return item.id === requestId;

                }
            );


        if (!request) {

            console.error(
                "Pickup request not found:",
                requestId
            );

            return;

        }


        // Save active request
        activeCollectorRequest =
            request;


        window.activeCollectorRequest =
            request;


        // Mark as accepted
        request.status =
            "Accepted";


        // Show verified collector ID
        showCollectorDigitalID(
            request
        );

    };

    // =========================================================
// FINAL PICKUP BUTTON FIX
// =========================================================

window.confirmPickup = async function () {

    console.log("Pickup button clicked");

    // Get address
    const addressElement = document.getElementById("addressInput");

    if (!addressElement) {
        alert("Pickup address field was not found.");
        return;
    }

    const address = addressElement.value.trim();

    if (!address) {
        alert("Please enter your pickup location.");
        addressElement.focus();
        return;
    }

    // Get actual weight
    const weightElement = document.getElementById("weightInput");

    const weight = weightElement
        ? Number(weightElement.value) || 0
        : 0;

    if (weight <= 0) {
        alert("Please enter the actual physical weight first.");
        closeModal();
        return;
    }

    // Get material safely
    let material = "";

    // First try global variable
    if (window.currentMaterial) {
        material = window.currentMaterial;
    }

    // Otherwise get it from the AI result on screen
    if (!material) {
        const materialElement =
            document.getElementById("materialResult");

        if (materialElement) {
            material = materialElement.innerText.trim();
        }
    }

    // Final fallback
    if (!material || material === "—") {
        material = "Recyclable Material";
    }

    // Disable button while submitting
    const buttons = document.querySelectorAll(
        "#pickupModal button"
    );

    let submitButton = null;

    buttons.forEach(button => {
        if (
            button.innerText.includes("Request Collector") ||
            button.innerText.includes("Confirm Pickup")
        ) {
            submitButton = button;
        }
    });

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerText = "Requesting Pickup...";
    }

    try {

        const response = await fetch("/pickup", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                material: material,
                weight: weight,
                address: address
            })
        });

        // Handle server error
        if (!response.ok) {
            throw new Error(
                "Server error: " + response.status
            );
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(
                data.error || "Pickup request failed."
            );
        }

        // Add request to collector queue
        if (
            typeof addPickupToCollectorQueue === "function"
        ) {
            addPickupToCollectorQueue(
                data.material || material,
                data.weight || weight,
                address,
                data.request_id
            );
        }

        // Close pickup modal
        const modal =
            document.getElementById("pickupModal");

        if (modal) {
            modal.style.display = "none";
        }

        // Success message
        alert(
            "✅ Collector Pickup Requested!\n\n" +
            "Request ID: " +
            data.request_id +
            "\n\n" +
            "Material: " +
            (data.material || material) +
            "\n" +
            "Weight: " +
            (data.weight || weight) +
            " kg\n" +
            "Location: " +
            address
        );

        // Clear address
        addressElement.value = "";

    } catch (error) {

        console.error(
            "Pickup Request Error:",
            error
        );

        alert(
            "❌ Pickup request failed.\n\n" +
            error.message
        );

    } finally {

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerText =
                "Request Collector Pickup";
        }
    }
};


// =========================================================
// SAFE CLOSE MODAL
// =========================================================

window.closeModal = function () {

    const modal =
        document.getElementById("pickupModal");

    if (modal) {
        modal.style.display = "none";
    }
};


// =========================================================
// SAFE REQUEST PICKUP
// =========================================================

window.requestPickup = function () {

    const weightElement =
        document.getElementById("weightInput");

    const weight = weightElement
        ? Number(weightElement.value) || 0
        : 0;

    if (weight <= 0) {

        alert(
            "Please enter the actual physical weight first."
        );

        if (weightElement) {
            weightElement.focus();
        }

        return;
    }

    const modal =
        document.getElementById("pickupModal");

    if (!modal) {
        alert("Pickup modal could not be found.");
        return;
    }

    modal.style.display = "flex";
};


// =========================================================
// END PICKUP FIX
// =========================================================

// =========================================================
// KABADI SETU - PICKUP MODAL FINAL HANDLER
// =========================================================

(function () {

    function setupPickupButton() {

        const button =
            document.getElementById("confirmPickupButton");

        if (!button) {
            console.error(
                "Kabadi Setu: confirmPickupButton not found."
            );
            return;
        }

        // Prevent duplicate listeners
        if (button.dataset.pickupReady === "true") {
            return;
        }

        button.dataset.pickupReady = "true";

        button.addEventListener("click", async function (event) {

            event.preventDefault();
            event.stopPropagation();

            console.log(
                "KABADI SETU: PICKUP BUTTON CLICKED"
            );

            const addressInput =
                document.getElementById("addressInput");

            const weightInput =
                document.getElementById("weightInput");

            if (!addressInput) {
                alert("Address field not found.");
                return;
            }

            const address =
                addressInput.value.trim();

            if (!address) {
                alert(
                    "Please enter your pickup location."
                );

                addressInput.focus();

                return;
            }

            const weight =
                weightInput
                    ? Number(weightInput.value)
                    : 0;

            if (weight <= 0) {

                alert(
                    "Please enter the actual physical weight first."
                );

                if (weightInput) {
                    weightInput.focus();
                }

                return;
            }

            // ---------------------------------------------
            // GET MATERIAL
            // ---------------------------------------------

            let material = "";

            if (
                typeof window.currentMaterial !==
                "undefined"
            ) {
                material =
                    window.currentMaterial || "";
            }

            if (!material) {

                const materialResult =
                    document.getElementById(
                        "materialResult"
                    );

                if (materialResult) {

                    material =
                        materialResult.innerText.trim();
                }
            }

            if (
                !material ||
                material === "—" ||
                material === "-"
            ) {

                alert(
                    "Please analyze the waste image first."
                );

                return;
            }

            // ---------------------------------------------
            // BUTTON LOADING STATE
            // ---------------------------------------------

            button.disabled = true;

            button.innerText =
                "Requesting Pickup...";

            // ---------------------------------------------
            // SEND REQUEST TO FLASK
            // ---------------------------------------------

            try {

                console.log(
                    "Sending pickup request:",
                    {
                        material: material,
                        weight: weight,
                        address: address
                    }
                );

                const response =
                    await fetch(
                        "/pickup",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    material:
                                        material,

                                    weight:
                                        weight,

                                    address:
                                        address
                                })
                        }
                    );

                console.log(
                    "Pickup server status:",
                    response.status
                );

                if (!response.ok) {

                    throw new Error(
                        "Server returned HTTP " +
                        response.status
                    );
                }

                const data =
                    await response.json();

                console.log(
                    "Pickup server response:",
                    data
                );

                if (!data.success) {

                    throw new Error(
                        data.error ||
                        "Pickup request failed."
                    );
                }

                // -----------------------------------------
                // ADD TO COLLECTOR QUEUE
                // -----------------------------------------

                if (
                    typeof window.addPickupToCollectorQueue ===
                    "function"
                ) {

                    window.addPickupToCollectorQueue(
                        data.material ||
                            material,

                        data.weight ||
                            weight,

                        address,

                        data.request_id
                    );
                }

                // -----------------------------------------
                // CLOSE MODAL
                // -----------------------------------------

                const modal =
                    document.getElementById(
                        "pickupModal"
                    );

                if (modal) {

                    modal.style.display =
                        "none";
                }

                // -----------------------------------------
                // SUCCESS
                // -----------------------------------------

                alert(
                    "✅ Pickup Request Created!\n\n" +

                    "Request ID: " +
                    data.request_id +

                    "\n\nMaterial: " +
                    (data.material ||
                        material) +

                    "\nWeight: " +
                    (data.weight ||
                        weight) +
                    " kg" +

                    "\nLocation: " +
                    address
                );

                // Clear address
                addressInput.value = "";

            } catch (error) {

                console.error(
                    "KABADI SETU PICKUP ERROR:",
                    error
                );

                alert(
                    "❌ Pickup request failed.\n\n" +
                    error.message
                );

            } finally {

                button.disabled = false;

                button.innerText =
                    "Request Collector Pickup";
            }

        });
    }


    // ---------------------------------------------
    // INITIAL SETUP
    // ---------------------------------------------

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            setupPickupButton
        );

    } else {

        setupPickupButton();
    }

})();

// =========================================================
// KABADI SETU - UNIFIED WASTE JOURNEY TRACKING
// STEP 1A
// =========================================================

let wasteJourneyTransactions = [];

/*
    Create one unified journey for every household pickup.
*/
function createWasteJourney(request) {

    if (!request) {
        return null;
    }

    const journeyId =
        request.transactionId ||
        (
            "KS-TXN-" +
            new Date().getFullYear() +
            String(new Date().getMonth() + 1).padStart(2, "0") +
            String(new Date().getDate()).padStart(2, "0") +
            "-" +
            String(Date.now()).slice(-6)
        );

    const journey = {
        id: journeyId,

        requestId: request.id || "",

        material: request.material || "Unknown",

        category: request.category || "Recyclable",

        estimatedWeight:
            Number(request.weight) || 0,

        actualWeight: null,

        householdPayment: 0,

        householdPaymentMethod: "",

        recycler: null,

        recyclerRate: 0,

        recyclerPayment: 0,

        status: "Pickup Requested",

        createdAt:
            new Date().toLocaleString(),

        timeline: [
            {
                key: "pickup_requested",
                title: "Pickup Requested",
                description:
                    "Household created a collector pickup request.",
                completed: true,
                time:
                    new Date().toLocaleString()
            },

            {
                key: "collector_accepted",
                title: "Collector Accepted",
                description:
                    "Waiting for collector to accept the pickup.",
                completed: false,
                time: null
            },

            {
                key: "weight_recorded",
                title: "Weight Recorded",
                description:
                    "Physical weight will be recorded by the collector.",
                completed: false,
                time: null
            },

            {
                key: "household_paid",
                title: "Household Payment",
                description:
                    "Payment to the household will be recorded.",
                completed: false,
                time: null
            },

            {
                key: "inventory_added",
                title: "Added to Collector Inventory",
                description:
                    "Collected material will appear in collector inventory.",
                completed: false,
                time: null
            },

            {
                key: "recycler_selected",
                title: "Recycler Selected",
                description:
                    "Collector will select the best available recycler.",
                completed: false,
                time: null
            },

            {
                key: "handover_prepared",
                title: "Handover Prepared",
                description:
                    "Material is prepared for verified recycler handover.",
                completed: false,
                time: null
            },

            {
                key: "recycler_confirmed",
                title: "Recycler Confirmed",
                description:
                    "Recycler confirmation is pending.",
                completed: false,
                time: null
            },

            {
                key: "completed",
                title: "Recycling Completed",
                description:
                    "Waste journey successfully completed.",
                completed: false,
                time: null
            }
        ]
    };

    wasteJourneyTransactions.unshift(journey);

    return journey;
}


/*
    Find a journey using the original pickup request ID.
*/
function findWasteJourneyByRequestId(requestId) {

    return wasteJourneyTransactions.find(
        journey =>
            journey.requestId === requestId
    );
}


/*
    Find a journey using transaction ID.
*/
function findWasteJourney(transactionId) {

    return wasteJourneyTransactions.find(
        journey =>
            journey.id === transactionId
    );
}


/*
    Mark a journey step as completed.
*/
function completeWasteJourneyStep(
    journey,
    stepKey,
    extraData = {}
) {

    if (!journey) {
        return;
    }

    const step =
        journey.timeline.find(
            item =>
                item.key === stepKey
        );

    if (step) {

        step.completed = true;

        step.time =
            new Date().toLocaleString();

        if (extraData.description) {
            step.description =
                extraData.description;
        }
    }

    Object.assign(
        journey,
        extraData
    );
}


/*
    Get the current journey status.
*/
function getWasteJourneyStatus(journey) {

    if (!journey) {
        return "Unknown";
    }

    const completed =
        journey.timeline.filter(
            step => step.completed
        ).length;

    const total =
        journey.timeline.length;

    if (completed === total) {
        return "Recycling Completed";
    }

    const lastCompleted =
        [...journey.timeline]
            .reverse()
            .find(
                step => step.completed
            );

    return lastCompleted
        ? lastCompleted.title
        : "Pickup Requested";
}


/*
    Debug helper.
    We will connect the existing collection,
    recycler and QR functions to this journey
    in the next steps.
*/
window.getWasteJourney =
    function(transactionId) {

        const journey =
            findWasteJourney(transactionId);

        if (!journey) {
            console.warn(
                "Waste journey not found:",
                transactionId
            );

            return null;
        }

        console.log(
            "KABADI SETU WASTE JOURNEY:",
            journey
        );

        return journey;
    };


console.log(
    "✅ Kabadi Setu unified waste journey system loaded."
);
// =========================================================
// STEP 1B - CONNECT PICKUP TO WASTE JOURNEY
// =========================================================

(function () {

    const originalAddPickupToCollectorQueue =
        window.addPickupToCollectorQueue;

    window.addPickupToCollectorQueue = function (
        material,
        weight,
        address,
        requestId
    ) {

        // Run the existing working collector queue logic first
        if (
            typeof originalAddPickupToCollectorQueue ===
            "function"
        ) {
            originalAddPickupToCollectorQueue(
                material,
                weight,
                address,
                requestId
            );
        }

        // Prevent duplicate journeys
        const existingJourney =
            findWasteJourneyByRequestId(
                requestId
            );

        if (existingJourney) {

            console.log(
                "Existing waste journey found:",
                existingJourney.id
            );

            return;
        }

        // Create unified waste journey
        const journey =
            createWasteJourney({

                id: requestId,

                material: material,

                category: "Household Pickup",

                weight: Number(weight) || 0

            });

        if (!journey) {
            return;
        }

        // Store pickup details
        journey.address =
            address || "";

        journey.requestId =
            requestId || "";

        journey.status =
            "Pickup Requested";

        console.log(
            "✅ Waste journey created:",
            journey.id
        );

        console.log(
            journey
        );

    };

})();


// =========================================================
// STEP 1B TEST HELPER
// =========================================================

window.showWasteJourneys = function () {

    console.table(
        wasteJourneyTransactions.map(
            journey => ({
                Transaction:
                    journey.id,

                Request:
                    journey.requestId,

                Material:
                    journey.material,

                Status:
                    getWasteJourneyStatus(
                        journey
                    ),

                StepsCompleted:
                    journey.timeline.filter(
                        step =>
                            step.completed
                    ).length,

                TotalSteps:
                    journey.timeline.length
            })
        )
    );

    return wasteJourneyTransactions;
};


console.log(
    "✅ Step 1B - Pickup journey connection loaded."
);

// =========================================================
// STEP 1C - COLLECTOR ACCEPTS PICKUP
// =========================================================

(function () {

    const originalAcceptCollectorRequest =
        window.acceptCollectorRequest;

    window.acceptCollectorRequest = function (requestId) {

        // Run the existing collector acceptance flow
        if (
            typeof originalAcceptCollectorRequest ===
            "function"
        ) {
            originalAcceptCollectorRequest(requestId);
        }

        // Find the unified waste journey
        const journey =
            findWasteJourneyByRequestId(
                requestId
            );

        if (!journey) {

            console.warn(
                "No unified waste journey found for:",
                requestId
            );

            return;
        }

        // Update journey
        completeWasteJourneyStep(
            journey,
            "collector_accepted",
            {
                status: "Collector Accepted",

                collectorAcceptedAt:
                    new Date().toLocaleString(),

                description:
                    "Collector accepted the household pickup request."
            }
        );

        console.log(
            "✅ Collector accepted waste journey:",
            journey.id
        );

        console.log(
            journey
        );
    };

})();


// =========================================================
// STEP 1C TEST HELPER
// =========================================================

window.checkWasteJourney =
    function (transactionId) {

        const journey =
            findWasteJourney(
                transactionId
            );

        if (!journey) {

            console.warn(
                "Transaction not found:",
                transactionId
            );

            return null;
        }

        console.table(
            journey.timeline.map(
                step => ({
                    Step: step.title,
                    Completed: step.completed,
                    Time: step.time || "-"
                })
            )
        );

        return journey;
    };


console.log(
    "✅ Step 1C - Collector acceptance tracking loaded."
);

// =========================================================
// STEP 1D - WEIGHT + PAYMENT + INVENTORY TRACKING
// =========================================================

(function () {

    const originalCompleteCollectorCollection =
        window.completeCollectorCollection ||
        completeCollectorCollection;

    window.completeCollectorCollection = function () {

        // Save the active request BEFORE the existing
        // function clears activeCollectorRequest.
        const requestBeforeCompletion =
            activeCollectorRequest;

        // Run the existing working collection process
        originalCompleteCollectorCollection();

        // Nothing to connect if there was no request
        if (!requestBeforeCompletion) {
            console.warn(
                "Step 1D: No active collector request found."
            );
            return;
        }

        // Find the unified journey using pickup request ID
        const journey =
            findWasteJourneyByRequestId(
                requestBeforeCompletion.id
            );

        if (!journey) {

            console.warn(
                "Step 1D: No unified journey found for:",
                requestBeforeCompletion.id
            );

            return;
        }

        // -------------------------------------------------
        // 1. ACTUAL PHYSICAL WEIGHT
        // -------------------------------------------------

        const actualWeight =
            Number(
                requestBeforeCompletion.finalWeight
            ) || 0;

        completeWasteJourneyStep(
            journey,
            "weight_recorded",
            {
                actualWeight:
                    actualWeight,

                description:
                    "Collector physically weighed the material and recorded the actual weight."
            }
        );


        // -------------------------------------------------
        // 2. PAYMENT TO HOUSEHOLD
        // -------------------------------------------------

        const householdPayment =
            Number(
                requestBeforeCompletion.finalValue
            ) || 0;

        completeWasteJourneyStep(
            journey,
            "household_paid",
            {
                householdPayment:
                    householdPayment,

                householdPaymentMethod:
                    requestBeforeCompletion.payment ||
                    "UPI",

                description:
                    "Collector recorded payment to the household."
            }
        );


        // -------------------------------------------------
        // 3. ADD TO COLLECTOR INVENTORY
        // -------------------------------------------------

        completeWasteJourneyStep(
            journey,
            "inventory_added",
            {
                inventoryAddedAt:
                    new Date().toLocaleString(),

                description:
                    "Collected material was added to the collector's inventory."
            }
        );


        // -------------------------------------------------
        // UPDATE JOURNEY STATUS
        // -------------------------------------------------

        journey.status =
            "Added to Collector Inventory";


        // Link the existing collector transaction
        // without replacing the unified KS-TXN ID.
        if (requestBeforeCompletion.transactionId) {

            journey.collectorTransactionId =
                requestBeforeCompletion.transactionId;
        }


        // Store final collection information
        journey.actualWeight =
            actualWeight;

        journey.householdPayment =
            householdPayment;

        journey.householdPaymentMethod =
            requestBeforeCompletion.payment ||
            "UPI";


        console.log(
            "✅ STEP 1D COMPLETE:",
            journey.id
        );

        console.log(
            "Actual weight:",
            actualWeight,
            "kg"
        );

        console.log(
            "Household payment:",
            householdPayment
        );

        console.log(
            "Payment method:",
            requestBeforeCompletion.payment ||
            "UPI"
        );

        console.log(
            "Journey status:",
            journey.status
        );

    };

})();


console.log(
    "✅ Step 1D - Weight, payment and inventory tracking loaded."
);

// =========================================================
// STEP 1E - RECYCLER SELECTION TRACKING
// CORRECTED VERSION
// =========================================================

(function () {

        // -------------------------------------------------
        // FIND THE ORIGINAL HOUSEHOLD JOURNEY
        // -------------------------------------------------

        let journey = null;


        // First try to find it through the inventory item
        // represented by the active handover.
        if (
    activeHandover &&
    activeHandover.material &&
    activeHandover.weight
) {
        journey =
    wasteJourneyTransactions.find(
        item => {

            if (!item) {
                return false;
            }

            return (
                item.material ===
                    activeHandover.material &&

                Number(
                    item.actualWeight
                ) ===
                    Number(
                        activeHandover.weight
                    ) &&

                item.status ===
                    "Recycler Selected"
            );
        }
    );

        }

        // -------------------------------------------------
        // FALLBACK:
        // FIND THE MOST RECENT JOURNEY THAT REACHED
        // COLLECTOR INVENTORY
        // -------------------------------------------------

        if (!journey) {

            journey =
                wasteJourneyTransactions.find(
                    item =>
                        item.status ===
                        "Added to Collector Inventory"
                );
        }


        if (!journey) {

            console.warn(
                "Step 1E: Could not find the household waste journey."
            );

            return;
        }


        // -------------------------------------------------
        // STORE SELECTED RECYCLER
        // -------------------------------------------------

        journey.recycler = {

            name:
                activeHandover.recycler,

            rate:
                Number(
                    activeHandover.recyclerRate
                ) || 0,

            estimatedValue:
                Number(
                    activeHandover.value
                ) || 0,

            distance:
                activeHandover.distance,

            rating:
                activeHandover.rating
        };


        // -------------------------------------------------
        // MARK RECYCLER SELECTED
        // -------------------------------------------------

        completeWasteJourneyStep(
            journey,
            "recycler_selected",
            {
                status:
                    "Recycler Selected",

                recyclerSelectedAt:
                    new Date().toLocaleString(),

                description:
                    "Best available verified recycler selected based on recycler rate."
            }
        );


        // -------------------------------------------------
        // LINK HANDOVER
        // -------------------------------------------------

        journey.handoverId =
            activeHandover.id;

        journey.handoverStatus =
            activeHandover.status;


        // -------------------------------------------------
        // LOG
        // -------------------------------------------------

        console.log(
            "✅ STEP 1E COMPLETE"
        );

        console.log(
            "Transaction:",
            journey.id
        );

        console.log(
            "Recycler:",
            activeHandover.recycler
        );

        console.log(
            "Recycler rate:",
            activeHandover.recyclerRate
        );

        console.log(
            "Estimated value:",
            activeHandover.value
        );

        console.log(
            "Journey status:",
            journey.status
        );

    }


)();


console.log(
    "✅ Step 1E - Recycler selection tracking loaded."
);

// ============================================================
// STEP 1F - HANDOVER PREPARED TRACKING
// ============================================================

(function () {

    const originalGenerateHandoverQR =
        window.generateHandoverQR;

    if (typeof originalGenerateHandoverQR !== "function") {
        console.warn(
            "Step 1F: generateHandoverQR function not found."
        );
        return;
    }

    window.generateHandoverQR = function () {

        // Run the existing QR/token generation first
        originalGenerateHandoverQR();

        if (!activeHandover) {
            console.warn(
                "Step 1F: No active handover found."
            );
            return;
        }

        // Find the corresponding household journey
        let journey = null;

        // Best match: handover ID created during Step 1E
        journey = wasteJourneyTransactions.find(
            item =>
                item.handoverId === activeHandover.id
        );

        // Fallback match using material + actual weight
        if (!journey) {
            journey = wasteJourneyTransactions.find(
                item =>
                    item.material === activeHandover.material &&
                    Number(item.actualWeight) ===
                        Number(activeHandover.weight) &&
                    item.status === "Recycler Selected"
            );
        }

        if (!journey) {
            console.warn(
                "Step 1F: Could not find corresponding waste journey."
            );
            return;
        }

        // Save secure handover information
        journey.handoverId =
            activeHandover.id;

        journey.handoverToken =
            activeHandover.token || "";

        journey.handoverPreparedAt =
            new Date().toLocaleString();

        journey.handoverRecycler =
            activeHandover.recycler;

        journey.handoverWeight =
            Number(activeHandover.weight) || 0;

        journey.handoverValue =
            Number(activeHandover.value) || 0;

        // Complete Step 1F
        completeWasteJourneyStep(
            journey,
            "handover_prepared",
            {
                status: "Handover Prepared",
                description:
                    "Handover token generated and material prepared for verified recycler receipt."
            }
        );

        console.log(
            "✅ STEP 1F COMPLETE"
        );

        console.log(
            "Transaction:",
            journey.id
        );

        console.log(
            "Handover ID:",
            journey.handoverId
        );

        console.log(
            "Secure Token:",
            journey.handoverToken
        );

        console.log(
            "Recycler:",
            journey.handoverRecycler
        );

        console.log(
            "Journey status:",
            journey.status
        );
    };

})();

console.log(
    "✅ Step 1F - Handover preparation tracking loaded."
);
// ============================================================
// STEP 1G - RECYCLER CONFIRMS RECEIPT
// ============================================================

(function () {

    const originalConfirmRecyclerReceipt =
        window.confirmRecyclerReceipt;

    if (
        typeof originalConfirmRecyclerReceipt !== "function"
    ) {
        console.warn(
            "Step 1G: confirmRecyclerReceipt function not found."
        );
        return;
    }

    window.confirmRecyclerReceipt = function () {

        // Save the active handover before the existing
        // function modifies it.
        const handoverBeforeConfirmation =
            activeHandover
                ? { ...activeHandover }
                : null;

        // Run the existing recycler confirmation
        originalConfirmRecyclerReceipt();

        if (!handoverBeforeConfirmation) {
            console.warn(
                "Step 1G: No active handover found."
            );
            return;
        }

        // Find the corresponding unified journey
        const journey =
            wasteJourneyTransactions.find(
                item =>
                    item.handoverId ===
                    handoverBeforeConfirmation.id
            );

        if (!journey) {
            console.warn(
                "Step 1G: Could not find corresponding waste journey."
            );
            return;
        }

        // Save recycler confirmation details
        journey.recyclerConfirmedAt =
            new Date().toLocaleString();

        journey.recyclerConfirmationId =
            handoverBeforeConfirmation.id;

        journey.recyclerConfirmationStatus =
            "Confirmed";

        journey.finalRecyclerValue =
    Number(
        handoverBeforeConfirmation.recycler?.estimated_value
    ) ||
    (
        Number(
            handoverBeforeConfirmation.recycler?.rate
        ) *
        Number(
            handoverBeforeConfirmation.weight
        )
    ) ||
    0;

        // Complete Step 1G
        completeWasteJourneyStep(
            journey,
            "recycler_confirmed",
            {
                status: "Recycler Confirmed",
                description:
                    "Authorized recycler confirmed receipt of the material."
            }
        );

        console.log(
            "========================================"
        );

        console.log(
            "✅ STEP 1G COMPLETE"
        );

        console.log(
            "Transaction:",
            journey.id
        );

        console.log(
            "Recycler:",
            handoverBeforeConfirmation.recycler
        );

        console.log(
            "Material:",
            handoverBeforeConfirmation.material
        );

        console.log(
            "Weight:",
            handoverBeforeConfirmation.weight,
            "kg"
        );

        console.log(
            "Recycler Value:",
            handoverBeforeConfirmation.value
        );

        console.log(
            "Confirmation Time:",
            journey.recyclerConfirmedAt
        );

        console.log(
            "Journey status:",
            journey.status
        );

        console.log(
            "========================================"
        );
    };

})();

console.log(
    "✅ Step 1G - Recycler receipt tracking loaded."
);

// ============================================================
// STEP 1F - HANDOVER PREPARED TRACKING
// ============================================================

(function () {

    const originalGenerateHandoverQR =
        window.generateHandoverQR;

    if (
        typeof originalGenerateHandoverQR !==
        "function"
    ) {
        console.warn(
            "Step 1F: generateHandoverQR function not found."
        );
        return;
    }

    window.generateHandoverQR =
        function () {

            // Run the existing QR/token system first
            originalGenerateHandoverQR();

            if (!activeHandover) {
                console.warn(
                    "Step 1F: No active handover found."
                );
                return;
            }

            // ------------------------------------------------
            // Get the correct handover ID
            // ------------------------------------------------

            const handoverId =
                activeHandover.handoverId ||
                activeHandover.id ||
                "";

            const token =
                activeHandover.token ||
                "";

            // ------------------------------------------------
            // Find the corresponding waste journey
            // ------------------------------------------------

            let journey = null;

            // First try the handover ID
            if (handoverId) {

                journey =
                    wasteJourneyTransactions.find(
                        item =>
                            item.handoverId ===
                            handoverId
                    );
            }

            // Fallback: material + actual weight
            if (!journey) {

                journey =
                    wasteJourneyTransactions.find(
                        item =>
                            item.material ===
                                activeHandover.material &&

                            Number(
                                item.actualWeight
                            ) ===
                                Number(
                                    activeHandover.weight
                                ) &&

                            item.status ===
                                "Recycler Selected"
                    );
            }

            // Final fallback: latest Recycler Selected journey
            if (!journey) {

                journey =
                    [...wasteJourneyTransactions]
                        .reverse()
                        .find(
                            item =>
                                item.status ===
                                "Recycler Selected"
                        );
            }

            if (!journey) {

                console.warn(
                    "Step 1F: Could not find corresponding waste journey."
                );

                return;
            }

            // ------------------------------------------------
            // Save handover information
            // ------------------------------------------------

            journey.handoverId =
                handoverId;

            journey.handoverToken =
                token;

            journey.handoverPreparedAt =
                new Date().toLocaleString();

            journey.handoverRecycler =
                activeHandover.recycler;

            journey.handoverWeight =
                Number(
                    activeHandover.weight
                ) || 0;

            journey.handoverValue =
                Number(
                    activeHandover.value
                ) ||
                Number(
                    activeHandover.recycler?.estimated_value
                ) ||
                0;

            // ------------------------------------------------
            // Complete Step 1F
            // ------------------------------------------------

            completeWasteJourneyStep(
                journey,
                "handover_prepared",
                {
                    status:
                        "Handover Prepared",

                    description:
                        "Handover token generated and material prepared for verified recycler receipt."
                }
            );

            // ------------------------------------------------
            // Console verification
            // ------------------------------------------------

            console.log(
                "========================================"
            );

            console.log(
                "✅ STEP 1F COMPLETE"
            );

            console.log(
                "Transaction:",
                journey.id
            );

            console.log(
                "Handover ID:",
                journey.handoverId
            );

            console.log(
                "Secure Token:",
                journey.handoverToken
            );

            console.log(
                "Recycler:",
                activeHandover.recycler
            );

            console.log(
                "Material:",
                activeHandover.material
            );

            console.log(
                "Weight:",
                activeHandover.weight,
                "kg"
            );

            console.log(
                "Journey status:",
                journey.status
            );

            console.log(
                "========================================"
            );
        };

})();

console.log(
    "✅ Step 1F - Handover preparation tracking loaded."
);

// ============================================================
// STEP 1G - RECYCLER CONFIRMS RECEIPT
// ============================================================

(function () {

    const originalConfirmRecyclerReceipt =
        window.confirmRecyclerReceipt;

    if (
        typeof originalConfirmRecyclerReceipt !== "function"
    ) {
        console.warn(
            "Step 1G: confirmRecyclerReceipt function not found."
        );
        return;
    }

    window.confirmRecyclerReceipt = function () {

        // Save active handover before existing function changes it
        const handoverBeforeConfirmation =
            activeHandover
                ? { ...activeHandover }
                : null;

        // Run existing confirmation logic
        originalConfirmRecyclerReceipt();

        if (!handoverBeforeConfirmation) {
            console.warn(
                "Step 1G: No active handover found."
            );
            return;
        }

        // Find matching unified journey
        const journey =
            wasteJourneyTransactions.find(
                item =>
                    item &&
                    (
                        item.handoverId ===
                        handoverBeforeConfirmation.id ||

                        item.handoverId ===
                        handoverBeforeConfirmation.handoverId
                    )
            );

        if (!journey) {
            console.warn(
                "Step 1G: Could not find corresponding waste journey."
            );
            return;
        }

        // Save recycler confirmation information
        journey.recyclerConfirmedAt =
            new Date().toLocaleString();

        journey.recyclerConfirmationId =
            handoverBeforeConfirmation.handoverId ||
            handoverBeforeConfirmation.id ||
            "";

        journey.recyclerConfirmationStatus =
            "Confirmed";

       
       journey.finalRecyclerValue =
    Number(
        handoverBeforeConfirmation.recycler?.estimated_value
    ) ||
    (
        Number(
            handoverBeforeConfirmation.recycler?.rate
        ) *
        Number(
            handoverBeforeConfirmation.weight
        )
    ) ||
    0;

        // Complete Step 1G
        completeWasteJourneyStep(
            journey,
            "recycler_confirmed",
            {
                status: "Recycler Confirmed",

                description:
                    "Authorized recycler confirmed receipt of the material."
            }
        );

        console.log(
            "========================================"
        );

        console.log(
            "✅ STEP 1G COMPLETE"
        );

        console.log(
            "Transaction:",
            journey.id
        );

        console.log(
            "Recycler:",
            handoverBeforeConfirmation.recycler
        );

        console.log(
            "Material:",
            handoverBeforeConfirmation.material
        );

        console.log(
            "Weight:",
            handoverBeforeConfirmation.weight,
            "kg"
        );

        console.log(
            "Recycler Value:",
            handoverBeforeConfirmation.value
        );

        console.log(
            "Confirmation Time:",
            journey.recyclerConfirmedAt
        );

        console.log(
            "Journey status:",
            journey.status
        );

        console.log(
            "========================================"
        );
    };

})();

console.log(
    "✅ Step 1G - Recycler receipt tracking loaded."
);

// ============================================================
// STEP 1H - RECYCLING COMPLETED
// ============================================================
// ============================================================
// STEP 1H - RECYCLING COMPLETED
// ============================================================

(function () {

    const previousConfirmRecyclerReceipt =
        window.confirmRecyclerReceipt;

    if (
        typeof previousConfirmRecyclerReceipt !==
        "function"
    ) {
        console.warn(
            "Step 1H: confirmRecyclerReceipt function not found."
        );
        return;
    }

    window.confirmRecyclerReceipt =
        function () {

            // Save the handover BEFORE the existing
            // confirmation function changes anything.
            const savedHandover =
                activeHandover
                    ? {
                        ...activeHandover
                    }
                    : null;

            if (!savedHandover) {

                console.warn(
                    "Step 1H: No active handover found."
                );

                return;
            }

            // Run the existing Step 1G confirmation.
            previousConfirmRecyclerReceipt();

            // ------------------------------------------------
            // FIND THE UNIFIED WASTE JOURNEY
            // ------------------------------------------------

            let journey = null;

            const savedHandoverId =
                savedHandover.handoverId ||
                savedHandover.id ||
                "";

            if (savedHandoverId) {

                journey =
                    wasteJourneyTransactions.find(
                        item =>
                            item &&
                            item.handoverId ===
                                savedHandoverId
                    );
            }

            // Fallback: find the journey that was just
            // confirmed by Step 1G.

            if (!journey) {

                journey =
                    wasteJourneyTransactions.find(
                        item =>
                            item &&
                            item.status ===
                                "Recycler Confirmed" &&

                            item.material ===
                                savedHandover.material
                    );
            }

            // Final fallback: most recent journey that
            // reached Recycler Confirmed.

            if (!journey) {

                journey =
                    [...wasteJourneyTransactions]
                        .reverse()
                        .find(
                            item =>
                                item &&
                                item.status ===
                                    "Recycler Confirmed"
                        );
            }

            if (!journey) {

                console.warn(
                    "Step 1H: Could not find waste journey."
                );

                return;
            }

            // ------------------------------------------------
            // CALCULATE FINAL RECYCLER VALUE
            // ------------------------------------------------

            let finalRecyclerValue = 0;

            if (
                savedHandover.recycler &&
                typeof savedHandover.recycler ===
                    "object"
            ) {

                finalRecyclerValue =
                    Number(
                        savedHandover.recycler
                            .estimated_value
                    ) || 0;

                if (!finalRecyclerValue) {

                    finalRecyclerValue =
                        Number(
                            savedHandover.recycler.rate
                        ) *
                        Number(
                            savedHandover.weight
                        );
                }
            }

            if (!finalRecyclerValue) {

                finalRecyclerValue =
                    Number(
                        savedHandover.value
                    ) || 0;
            }

            // ------------------------------------------------
            // SAVE FINAL JOURNEY INFORMATION
            // ------------------------------------------------

            journey.finalRecycler =
                savedHandover.recycler;

            journey.finalWeight =
                Number(
                    savedHandover.weight
                ) || 0;

            journey.finalRecyclerValue =
                finalRecyclerValue;

            journey.finalHandoverId =
                savedHandoverId;

            journey.recyclingCompletedAt =
                new Date().toLocaleString();

            // ------------------------------------------------
            // COMPLETE FINAL STEP
            // ------------------------------------------------

            completeWasteJourneyStep(
                journey,
                "completed",
                {
                    status:
                        "Recycling Completed",

                    description:
                        "Recycler confirmed receipt and the waste journey was completed successfully."
                }
            );

            // ------------------------------------------------
            // FINAL LOG
            // ------------------------------------------------

            console.log(
                "========================================"
            );

            console.log(
                "🎉 STEP 1H COMPLETE"
            );

            console.log(
                "♻️ RECYCLING COMPLETED"
            );

            console.log(
                "Transaction:",
                journey.id
            );

            console.log(
                "Material:",
                journey.material
            );

            console.log(
                "Final Weight:",
                journey.finalWeight,
                "kg"
            );

            console.log(
                "Recycler:",
                journey.finalRecycler
            );

            console.log(
                "Final Recycler Value:",
                journey.finalRecyclerValue
            );

            console.log(
                "Handover ID:",
                journey.finalHandoverId
            );

            console.log(
                "Completed At:",
                journey.recyclingCompletedAt
            );

            console.log(
                "Journey status:",
                journey.status
            );

            console.log(
                "========================================"
            );
        };

})();

console.log(
    "✅ Step 1H - Recycling completion tracking loaded."
);

// ============================================================
// STEP 2A - WASTE JOURNEY TRACKING UI
// ============================================================

(function () {

    // ----------------------------------------------------------
    // GET RECYCLER NAME
    // ----------------------------------------------------------

    function getJourneyRecyclerName(journey) {

        if (!journey) {
            return "Not assigned";
        }

        if (
            journey.finalRecycler &&
            typeof journey.finalRecycler === "object"
        ) {
            return (
                journey.finalRecycler.name ||
                "Verified Recycler"
            );
        }

        if (
            journey.finalRecycler &&
            typeof journey.finalRecycler === "string"
        ) {
            return journey.finalRecycler;
        }

        if (
            journey.recycler &&
            typeof journey.recycler === "object"
        ) {
            return (
                journey.recycler.name ||
                "Verified Recycler"
            );
        }

        if (
            journey.recycler &&
            typeof journey.recycler === "string"
        ) {
            return journey.recycler;
        }

        return "Not assigned";
    }


    // ----------------------------------------------------------
    // GET RECYCLER RATE
    // ----------------------------------------------------------

    function getJourneyRecyclerRate(journey) {

        if (!journey) {
            return 0;
        }

        if (
            journey.recycler &&
            typeof journey.recycler === "object"
        ) {
            return (
                Number(
                    journey.recycler.rate
                ) || 0
            );
        }

        return (
            Number(
                journey.recyclerRate
            ) || 0
        );
    }


    // ----------------------------------------------------------
    // GET RECYCLER VALUE
    // ----------------------------------------------------------

    function getJourneyRecyclerValue(journey) {

        if (!journey) {
            return 0;
        }

        // Final value saved by Step 1H
        if (
            Number(
                journey.finalRecyclerValue
            ) > 0
        ) {
            return Number(
                journey.finalRecyclerValue
            );
        }

        // Recycler object estimated value
        if (
            journey.recycler &&
            typeof journey.recycler === "object"
        ) {

            const estimatedValue =
                Number(
                    journey.recycler.estimated_value
                ) || 0;

            if (estimatedValue > 0) {
                return estimatedValue;
            }
        }

        // Calculate from rate × weight
        const rate =
            getJourneyRecyclerRate(
                journey
            );

        const weight =
            Number(
                journey.finalWeight ||
                journey.actualWeight ||
                journey.estimatedWeight
            ) || 0;

        return rate * weight;
    }


    // ----------------------------------------------------------
    // GET WEIGHT
    // ----------------------------------------------------------

    function getJourneyWeight(journey) {

        if (!journey) {
            return 0;
        }

        return (
            Number(
                journey.finalWeight ||
                journey.actualWeight ||
                journey.estimatedWeight
            ) || 0
        );
    }


    // ----------------------------------------------------------
    // RENDER WASTE JOURNEY PANEL
    // ----------------------------------------------------------

    function renderWasteJourneyTracking() {

        const section =
            document.getElementById(
                "transactions"
            );

        if (!section) {
            return;
        }


        let panel =
            document.getElementById(
                "wasteJourneyTrackingPanel"
            );


        if (!panel) {

            panel =
                document.createElement(
                    "div"
                );

            panel.id =
                "wasteJourneyTrackingPanel";

            section.appendChild(
                panel
            );
        }


        const journeys =
            Array.isArray(
                wasteJourneyTransactions
            )
                ? wasteJourneyTransactions.filter(
                    journey =>
                        journey !== null &&
                        journey !== undefined
                )
                : [];


        // ------------------------------------------------------
        // NO JOURNEYS
        // ------------------------------------------------------

        if (journeys.length === 0) {

            panel.innerHTML = `

                <div style="
                    background:white;
                    border:1px solid #e5e7eb;
                    border-radius:20px;
                    padding:30px;
                    margin-top:20px;
                    text-align:center;
                    box-shadow:0 6px 20px rgba(0,0,0,.05);
                ">

                    <div style="
                        font-size:45px;
                        margin-bottom:10px;
                    ">
                        🔗
                    </div>

                    <h2 style="
                        margin:0;
                    ">
                        Waste Journey Tracking
                    </h2>

                    <p style="
                        color:#6b7280;
                        margin-top:8px;
                    ">
                        Complete a pickup request to see
                        its complete recycling journey.
                    </p>

                </div>

            `;

            return;
        }


        // ------------------------------------------------------
        // JOURNEY CARDS
        // ------------------------------------------------------

        panel.innerHTML = `

            <div style="
                margin-top:25px;
            ">

                <!-- SECTION HEADER -->

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                    flex-wrap:wrap;
                    margin-bottom:18px;
                ">

                    <div>

                        <div style="
                            color:#159570;
                            font-size:12px;
                            font-weight:800;
                            letter-spacing:1px;
                        ">
                            TRACEABILITY
                        </div>

                        <h2 style="
                            margin:5px 0 0;
                        ">
                            🔗 Waste Journey Tracking
                        </h2>

                        <p style="
                            margin:5px 0 0;
                            color:#6b7280;
                        ">
                            From household pickup to formal recycling.
                        </p>

                    </div>


                    <div style="
                        background:#ecfdf5;
                        color:#047857;
                        padding:9px 14px;
                        border-radius:12px;
                        font-weight:800;
                    ">
                        ${journeys.length}
                        Journey${journeys.length === 1 ? "" : "s"}
                    </div>

                </div>


                ${journeys.map(
                    journey => {

                        const completedSteps =
                            journey.timeline
                                ? journey.timeline.filter(
                                    step =>
                                        step &&
                                        step.completed
                                ).length
                                : 0;


                        const totalSteps =
                            journey.timeline
                                ? journey.timeline.length
                                : 9;


                        const progress =
                            Math.round(
                                (
                                    completedSteps /
                                    totalSteps
                                ) * 100
                            );


                        const weight =
                            getJourneyWeight(
                                journey
                            );


                        const recyclerName =
                            getJourneyRecyclerName(
                                journey
                            );


                        const recyclerRate =
                            getJourneyRecyclerRate(
                                journey
                            );


                        const recyclerValue =
                            getJourneyRecyclerValue(
                                journey
                            );


                        const isCompleted =
                            journey.status ===
                            "Recycling Completed";


                        return `

                            <div style="
                                background:white;
                                border:1px solid #e5e7eb;
                                border-radius:20px;
                                padding:22px;
                                margin-bottom:20px;
                                box-shadow:0 6px 20px rgba(0,0,0,.05);
                            ">

                                <!-- TRANSACTION HEADER -->

                                <div style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:flex-start;
                                    gap:15px;
                                    flex-wrap:wrap;
                                ">

                                    <div>

                                        <div style="
                                            font-size:19px;
                                            font-weight:800;
                                        ">
                                            ${journey.material}
                                        </div>

                                        <div style="
                                            color:#6b7280;
                                            margin-top:5px;
                                        ">
                                            ${weight.toFixed(2)} kg
                                            •
                                            ${journey.id}
                                        </div>

                                    </div>


                                    <div style="
                                        background:${
                                            isCompleted
                                                ? "#ecfdf5"
                                                : "#fff7ed"
                                        };
                                        color:${
                                            isCompleted
                                                ? "#047857"
                                                : "#c2410c"
                                        };
                                        padding:9px 13px;
                                        border-radius:10px;
                                        font-size:12px;
                                        font-weight:800;
                                    ">
                                        ${
                                            journey.status ||
                                            "In Progress"
                                        }
                                    </div>

                                </div>


                                <!-- PROGRESS -->

                                <div style="
                                    margin-top:20px;
                                ">

                                    <div style="
                                        display:flex;
                                        justify-content:space-between;
                                        margin-bottom:7px;
                                        font-size:13px;
                                    ">

                                        <strong>
                                            Journey Progress
                                        </strong>

                                        <strong>
                                            ${completedSteps}/${totalSteps}
                                        </strong>

                                    </div>


                                    <div style="
                                        width:100%;
                                        height:9px;
                                        background:#e5e7eb;
                                        border-radius:20px;
                                        overflow:hidden;
                                    ">

                                        <div style="
                                            width:${progress}%;
                                            height:100%;
                                            background:#159570;
                                            border-radius:20px;
                                        "></div>

                                    </div>

                                </div>


                                <!-- TIMELINE -->

                                <div style="
                                    margin-top:25px;
                                ">

                                    ${
                                        journey.timeline
                                            ? journey.timeline
                                                .map(
                                                    (
                                                        step,
                                                        index
                                                    ) => `

                                                        <div style="
                                                            display:flex;
                                                            gap:14px;
                                                        ">

                                                            <!-- ICON -->

                                                            <div style="
                                                                display:flex;
                                                                flex-direction:column;
                                                                align-items:center;
                                                                min-width:30px;
                                                            ">

                                                                <div style="
                                                                    width:30px;
                                                                    height:30px;
                                                                    border-radius:50%;
                                                                    display:flex;
                                                                    align-items:center;
                                                                    justify-content:center;
                                                                    background:${
                                                                        step.completed
                                                                            ? "#159570"
                                                                            : "#e5e7eb"
                                                                    };
                                                                    color:${
                                                                        step.completed
                                                                            ? "white"
                                                                            : "#9ca3af"
                                                                    };
                                                                    font-size:13px;
                                                                    font-weight:800;
                                                                ">
                                                                    ${
                                                                        step.completed
                                                                            ? "✓"
                                                                            : index + 1
                                                                    }
                                                                </div>


                                                                ${
                                                                    index <
                                                                    journey.timeline.length - 1
                                                                        ? `
                                                                            <div style="
                                                                                width:2px;
                                                                                height:32px;
                                                                                background:${
                                                                                    step.completed
                                                                                        ? "#9dd8c5"
                                                                                        : "#e5e7eb"
                                                                                };
                                                                            "></div>
                                                                        `
                                                                        : ""
                                                                }

                                                            </div>


                                                            <!-- STEP TEXT -->

                                                            <div style="
                                                                padding-bottom:13px;
                                                            ">

                                                                <div style="
                                                                    font-size:14px;
                                                                    font-weight:800;
                                                                ">
                                                                    ${
                                                                        step.title
                                                                    }
                                                                </div>


                                                                <div style="
                                                                    font-size:12px;
                                                                    color:#6b7280;
                                                                    margin-top:3px;
                                                                ">
                                                                    ${
                                                                        step.description ||
                                                                        ""
                                                                    }
                                                                </div>


                                                                ${
                                                                    step.time
                                                                        ? `
                                                                            <div style="
                                                                                font-size:11px;
                                                                                color:#9ca3af;
                                                                                margin-top:3px;
                                                                            ">
                                                                                ${step.time}
                                                                            </div>
                                                                        `
                                                                        : ""
                                                                }

                                                            </div>

                                                        </div>

                                                    `
                                                )
                                                .join("")
                                            : ""
                                    }

                                </div>


                                <!-- DETAILS -->

                                <div style="
                                    margin-top:8px;
                                    padding:17px;
                                    background:#f8fafc;
                                    border-radius:15px;
                                    display:grid;
                                    grid-template-columns:
                                        repeat(
                                            auto-fit,
                                            minmax(145px,1fr)
                                        );
                                    gap:16px;
                                ">


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            HOUSEHOLD PAYMENT
                                        </div>

                                        <div style="
                                            font-size:16px;
                                            font-weight:800;
                                            margin-top:4px;
                                        ">
                                            ₹${
                                                Number(
                                                    journey.householdPayment
                                                ).toFixed(2)
                                            }
                                        </div>

                                    </div>


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            RECYCLER
                                        </div>

                                        <div style="
                                            font-size:14px;
                                            font-weight:800;
                                            margin-top:4px;
                                        ">
                                            ${recyclerName}
                                        </div>

                                    </div>


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            RECYCLER RATE
                                        </div>

                                        <div style="
                                            font-size:16px;
                                            font-weight:800;
                                            margin-top:4px;
                                        ">
                                            ₹${recyclerRate.toFixed(2)}/kg
                                        </div>

                                    </div>


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            RECYCLER VALUE
                                        </div>

                                        <div style="
                                            font-size:16px;
                                            font-weight:800;
                                            margin-top:4px;
                                        ">
                                            ₹${recyclerValue.toFixed(2)}
                                        </div>

                                    </div>


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            HANDOVER ID
                                        </div>

                                        <div style="
                                            font-size:13px;
                                            font-weight:800;
                                            margin-top:4px;
                                            word-break:break-all;
                                        ">
                                            ${
                                                journey.finalHandoverId ||
                                                journey.handoverId ||
                                                "Pending"
                                            }
                                        </div>

                                    </div>


                                </div>


                                ${
                                    isCompleted
                                        ? `
                                            <div style="
                                                margin-top:16px;
                                                padding:12px 15px;
                                                background:#ecfdf5;
                                                border-radius:12px;
                                                color:#047857;
                                                font-size:13px;
                                                font-weight:800;
                                                text-align:center;
                                            ">
                                                ♻️ Recycling completed successfully
                                            </div>
                                        `
                                        : ""
                                }


                            </div>

                        `;
                    }
                ).join("")}

            </div>

        `;
    }


    // ----------------------------------------------------------
    // MAKE JOURNEY UI UPDATE AUTOMATICALLY
    // ----------------------------------------------------------

    const originalCompleteJourneyStep =
        window.completeWasteJourneyStep;


    if (
        typeof originalCompleteJourneyStep ===
        "function"
    ) {

        window.completeWasteJourneyStep =
            function (
                journey,
                stepKey,
                extraData = {}
            ) {

                originalCompleteJourneyStep(
                    journey,
                    stepKey,
                    extraData
                );

                renderWasteJourneyTracking();
            };
    }


    // ----------------------------------------------------------
    // GLOBAL ACCESS
    // ----------------------------------------------------------

    window.renderWasteJourneyTracking =
        renderWasteJourneyTracking;


    // ----------------------------------------------------------
    // INITIAL RENDER
    // ----------------------------------------------------------

    setTimeout(
        function () {

            renderWasteJourneyTracking();

        },
        500
    );


    console.log(
        "✅ Step 2A - Waste Journey Tracking UI loaded."
    );

})();

// ============================================================
// STEP 2C - FIX RECYCLER SELECTED TIMELINE
// ============================================================

(function () {

    function fixRecyclerSelectedStep() {

        if (
            !Array.isArray(
                wasteJourneyTransactions
            )
        ) {
            return;
        }

        wasteJourneyTransactions.forEach(
            function (journey) {

                if (
                    !journey ||
                    !Array.isArray(
                        journey.timeline
                    )
                ) {
                    return;
                }

                const recyclerStep =
                    journey.timeline.find(
                        function (step) {
                            return (
                                step &&
                                step.key ===
                                    "recycler_selected"
                            );
                        }
                    );

                if (!recyclerStep) {
                    return;
                }

                const handoverPrepared =
                    journey.timeline.find(
                        function (step) {
                            return (
                                step &&
                                step.key ===
                                    "handover_prepared" &&
                                step.completed === true
                            );
                        }
                    );

                const recyclerConfirmed =
                    journey.timeline.find(
                        function (step) {
                            return (
                                step &&
                                step.key ===
                                    "recycler_confirmed" &&
                                step.completed === true
                            );
                        }
                    );

                const recyclingCompleted =
                    journey.timeline.find(
                        function (step) {
                            return (
                                step &&
                                step.key ===
                                    "completed" &&
                                step.completed === true
                            );
                        }
                    );

                // If any later recycler/handover step is
                // completed, Recycler Selected definitely
                // happened first.

                if (
                    (
                        handoverPrepared ||
                        recyclerConfirmed ||
                        recyclingCompleted
                    ) &&
                    !recyclerStep.completed
                ) {

                    recyclerStep.completed =
                        true;

                    recyclerStep.time =
                        journey.recyclerSelectedAt ||
                        (
                            handoverPrepared
                                ? handoverPrepared.time
                                : new Date().toLocaleString()
                        );

                    recyclerStep.description =
                        "Verified recycler selected for the collected material.";

                    console.log(
                        "✅ Fixed Recycler Selected:",
                        journey.id
                    );
                }

            }
        );

        // Refresh the visible Transactions UI

        if (
            typeof renderWasteJourneyTracking ===
            "function"
        ) {
            renderWasteJourneyTracking();
        }

    }


    window.fixRecyclerSelectedStep =
        fixRecyclerSelectedStep;


    // Run automatically

    setTimeout(
        fixRecyclerSelectedStep,
        500
    );


    console.log(
        "✅ Step 2C - Recycler Selected timeline fix loaded."
    );

})();

// ============================================================
// STEP 3 - PERSIST WASTE JOURNEY TRANSACTIONS
// ============================================================

(function () {

    const STORAGE_KEY =
        "kabadiSetuWasteJourneyTransactions";


    // --------------------------------------------------------
    // LOAD SAVED JOURNEYS
    // --------------------------------------------------------

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (
                Array.isArray(parsed)
            ) {

                wasteJourneyTransactions.length = 0;

                parsed.forEach(
                    function (journey) {

                        if (journey) {
                            wasteJourneyTransactions.push(
                                journey
                            );
                        }

                    }
                );

                console.log(
                    "📂 Restored saved waste journeys:",
                    wasteJourneyTransactions.length
                );

            }

        } else {

            console.log(
                "ℹ️ No saved waste journeys found."
            );

        }

    } catch (error) {

        console.error(
            "❌ Could not load saved journeys:",
            error
        );

    }


    // --------------------------------------------------------
    // SAVE FUNCTION
    // --------------------------------------------------------

    function saveWasteJourneys() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    wasteJourneyTransactions
                )
            );

        } catch (error) {

            console.error(
                "❌ Could not save waste journeys:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // MAKE SAVE FUNCTION AVAILABLE
    // --------------------------------------------------------

    window.saveWasteJourneys =
        saveWasteJourneys;


    // --------------------------------------------------------
    // AUTO-SAVE
    //
    // This checks the actual array directly.
    // Therefore it works even when other functions call
    // createWasteJourney() or completeWasteJourneyStep()
    // directly.
    // --------------------------------------------------------

    setInterval(
        function () {

            if (
                Array.isArray(
                    wasteJourneyTransactions
                )
            ) {

                saveWasteJourneys();

            }

        },
        500
    );


    // --------------------------------------------------------
    // REFRESH JOURNEY UI
    // --------------------------------------------------------

    setTimeout(
        function () {

            if (
                typeof window.renderWasteJourneyTracking ===
                "function"
            ) {

                window.renderWasteJourneyTracking();

            }

        },
        800
    );


    console.log(
        "✅ Step 3 - Persistent waste journey storage loaded."
    );

})();

// ============================================================
// STEP 4A - ACTIVE WASTE JOURNEY ON HOUSEHOLD DASHBOARD
// ============================================================

(function () {

    function getDashboardJourneyWeight(journey) {

        return Number(
            journey.finalWeight ||
            journey.actualWeight ||
            journey.estimatedWeight ||
            0
        );
    }


    function getDashboardRecycler(journey) {

        if (
            journey.finalRecycler &&
            typeof journey.finalRecycler === "object"
        ) {
            return (
                journey.finalRecycler.name ||
                "Verified Recycler"
            );
        }

        if (
            journey.recycler &&
            typeof journey.recycler === "object"
        ) {
            return (
                journey.recycler.name ||
                "Verified Recycler"
            );
        }

        return "Not selected yet";
    }


    function getDashboardRecyclerValue(journey) {

        if (
            Number(journey.finalRecyclerValue) > 0
        ) {
            return Number(
                journey.finalRecyclerValue
            );
        }

        if (
            journey.recycler &&
            typeof journey.recycler === "object"
        ) {
            return Number(
                journey.recycler.estimated_value
            ) || 0;
        }

        return 0;
    }


    function renderDashboardJourney() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (!dashboard) {
            return;
        }


        let card =
            document.getElementById(
                "dashboardJourneyCard"
            );


        if (!card) {

            card =
                document.createElement(
                    "div"
                );

            card.id =
                "dashboardJourneyCard";

            dashboard.appendChild(
                card
            );
        }


        const journeys =
            Array.isArray(
                wasteJourneyTransactions
            )
                ? wasteJourneyTransactions
                : [];


        if (journeys.length === 0) {

            card.innerHTML = "";

            return;
        }


        // Most recent journey

        const journey =
            journeys[0];


        if (!journey) {
            card.innerHTML = "";
            return;
        }


        const timeline =
            Array.isArray(
                journey.timeline
            )
                ? journey.timeline
                : [];


        const completed =
            timeline.filter(
                step =>
                    step &&
                    step.completed === true
            ).length;


        const total =
            timeline.length || 9;


        const progress =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );


        const weight =
            getDashboardJourneyWeight(
                journey
            );


        const recycler =
            getDashboardRecycler(
                journey
            );


        const recyclerValue =
            getDashboardRecyclerValue(
                journey
            );


        const completedJourney =
            journey.status ===
            "Recycling Completed";


        const currentStep =
            [...timeline]
                .reverse()
                .find(
                    step =>
                        step &&
                        step.completed === true
                );


        const currentStatus =
            journey.status ||
            (
                currentStep
                    ? currentStep.title
                    : "Pickup Requested"
            );


        card.innerHTML = `

            <div style="
                margin-top:28px;
                background:white;
                border:1px solid #e5e7eb;
                border-radius:22px;
                padding:24px;
                box-shadow:0 8px 25px rgba(0,0,0,.06);
            ">

                <!-- HEADER -->

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:15px;
                    flex-wrap:wrap;
                ">

                    <div>

                        <div style="
                            color:#159570;
                            font-size:12px;
                            font-weight:800;
                            letter-spacing:1px;
                        ">
                            ${completedJourney
                                ? "RECYCLING COMPLETED"
                                : "ACTIVE RECYCLING JOURNEY"}
                        </div>

                        <h2 style="
                            margin:5px 0 0;
                        ">
                            🔗 ${journey.material}
                        </h2>

                        <p style="
                            margin:5px 0 0;
                            color:#6b7280;
                            font-size:13px;
                        ">
                            ${weight.toFixed(2)} kg
                            •
                            ${journey.id}
                        </p>

                    </div>


                    <div style="
                        background:${
                            completedJourney
                                ? "#ecfdf5"
                                : "#fff7ed"
                        };
                        color:${
                            completedJourney
                                ? "#047857"
                                : "#c2410c"
                        };
                        padding:9px 13px;
                        border-radius:10px;
                        font-size:12px;
                        font-weight:800;
                    ">
                        ${currentStatus}
                    </div>

                </div>


                <!-- PROGRESS -->

                <div style="
                    margin-top:22px;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        margin-bottom:7px;
                        font-size:13px;
                    ">

                        <strong>
                            Journey Progress
                        </strong>

                        <strong>
                            ${completed}/${total}
                        </strong>

                    </div>


                    <div style="
                        width:100%;
                        height:9px;
                        background:#e5e7eb;
                        border-radius:20px;
                        overflow:hidden;
                    ">

                        <div style="
                            width:${progress}%;
                            height:100%;
                            background:#159570;
                            border-radius:20px;
                        "></div>

                    </div>

                </div>


                <!-- CURRENT STATUS -->

                <div style="
                    margin-top:20px;
                    padding:14px 16px;
                    background:#f8fafc;
                    border-radius:14px;
                    display:flex;
                    align-items:center;
                    gap:12px;
                ">

                    <div style="
                        width:38px;
                        height:38px;
                        border-radius:50%;
                        background:#ecfdf5;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:19px;
                    ">
                        ${
                            completedJourney
                                ? "♻️"
                                : "🚚"
                        }
                    </div>

                    <div>

                        <div style="
                            font-size:11px;
                            color:#6b7280;
                            font-weight:700;
                        ">
                            CURRENT STATUS
                        </div>

                        <div style="
                            font-size:15px;
                            font-weight:800;
                            margin-top:2px;
                        ">
                            ${currentStatus}
                        </div>

                    </div>

                </div>


                <!-- DETAILS -->

                <div style="
                    margin-top:16px;
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(160px,1fr)
                        );
                    gap:12px;
                ">

                    <div style="
                        padding:13px;
                        background:#f8fafc;
                        border-radius:12px;
                    ">

                        <div style="
                            font-size:10px;
                            color:#6b7280;
                        ">
                            COLLECTOR PAYMENT
                        </div>

                        <strong>
                            ₹${Number(
                                journey.householdPayment || 0
                            ).toFixed(2)}
                        </strong>

                    </div>


                    <div style="
                        padding:13px;
                        background:#f8fafc;
                        border-radius:12px;
                    ">

                        <div style="
                            font-size:10px;
                            color:#6b7280;
                        ">
                            RECYCLER
                        </div>

                        <strong style="
                            font-size:13px;
                        ">
                            ${recycler}
                        </strong>

                    </div>


                    ${
                        recyclerValue > 0
                            ? `
                                <div style="
                                    padding:13px;
                                    background:#f8fafc;
                                    border-radius:12px;
                                ">

                                    <div style="
                                        font-size:10px;
                                        color:#6b7280;
                                    ">
                                        RECYCLER VALUE
                                    </div>

                                    <strong>
                                        ₹${recyclerValue.toFixed(2)}
                                    </strong>

                                </div>
                            `
                            : ""
                    }

                </div>


                <!-- VIEW TRANSACTION -->

                <button
                    type="button"
                    onclick="showSection('transactions')"
                    style="
                        width:100%;
                        margin-top:18px;
                        padding:12px;
                        border:none;
                        border-radius:12px;
                        background:#159570;
                        color:white;
                        font-size:14px;
                        font-weight:800;
                        cursor:pointer;
                    "
                >
                    View Full Waste Journey →
                </button>

            </div>

        `;

    }


    window.renderDashboardJourney =
        renderDashboardJourney;


    // --------------------------------------------------------
    // INITIAL RENDER
    // --------------------------------------------------------

    setTimeout(
        renderDashboardJourney,
        700
    );


    // --------------------------------------------------------
    // REFRESH WHEN DASHBOARD IS OPENED
    // --------------------------------------------------------

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".nav-item"
                );

            if (!button) {
                return;
            }


            if (
                button.innerText
                    .toLowerCase()
                    .includes("dashboard")
            ) {

                setTimeout(
                    renderDashboardJourney,
                    200
                );

            }

        }
    );


    // --------------------------------------------------------
    // KEEP UI SYNCHRONIZED WITH JOURNEY DATA
    // --------------------------------------------------------

    setInterval(
        function () {

            if (
                Array.isArray(
                    wasteJourneyTransactions
                ) &&
                wasteJourneyTransactions.length
            ) {

                renderDashboardJourney();

            }

        },
        1000
    );


    console.log(
        "✅ Step 4A - Dashboard waste journey loaded."
    );

})();

// ============================================================
// STEP 4B - RECYCLER RATE + PRICE COMPARISON FIX
// ============================================================

(function () {

    console.log("🚀 Step 4B - Recycler price comparison fix loaded.");

    // ----------------------------------------------------------
    // NORMALIZE RECYCLER DATA
    // ----------------------------------------------------------

    function normalizeRecycler(recycler, weight) {

        if (!recycler) {
            return null;
        }

        const safeWeight =
            Number(weight) || 0;

        const rate =
            Number(
                recycler.rate ??
                recycler.recyclerRate ??
                recycler.price ??
                0
            ) || 0;

        let estimatedValue =
            Number(
                recycler.estimated_value ??
                recycler.estimatedValue ??
                recycler.value ??
                0
            ) || 0;

        // If backend did not provide estimated value,
        // calculate it from rate × physical weight.
        if (estimatedValue <= 0 && rate > 0 && safeWeight > 0) {
            estimatedValue =
                rate * safeWeight;
        }

        return {
            ...recycler,

            name:
                recycler.name ||
                "Unknown Recycler",

            rate:
                rate,

            estimated_value:
                estimatedValue,

            estimatedValue:
                estimatedValue,

            distance:
                recycler.distance ||
                "Distance unavailable",

            rating:
                Number(recycler.rating) || 0,

            authorization:
                recycler.authorization ||
                "Verified",

            pickup:
                Boolean(recycler.pickup)
        };
    }


    // ----------------------------------------------------------
    // FIX JOURNEY RECYCLER DATA
    // ----------------------------------------------------------

    function fixJourneyRecyclerData() {

        if (
            typeof wasteJourneyTransactions ===
            "undefined"
        ) {
            return;
        }

        wasteJourneyTransactions.forEach(
            function (journey) {

                if (!journey) {
                    return;
                }

                const weight =
                    Number(
                        journey.finalWeight ||
                        journey.actualWeight ||
                        journey.estimatedWeight
                    ) || 0;


                // ------------------------------------------------
                // CASE 1:
                // Recycler is already an object
                // ------------------------------------------------

                if (
                    journey.recycler &&
                    typeof journey.recycler === "object"
                ) {

                    const recycler =
                        normalizeRecycler(
                            journey.recycler,
                            weight
                        );

                    journey.recycler =
                        recycler;

                    journey.recyclerRate =
                        recycler.rate;

                    if (
                        !journey.finalRecyclerValue &&
                        recycler.estimated_value > 0
                    ) {

                        journey.finalRecyclerValue =
                            recycler.estimated_value;
                    }
                }


                // ------------------------------------------------
                // CASE 2:
                // Recycler was saved as a string
                // ------------------------------------------------

                else if (
                    journey.recycler &&
                    typeof journey.recycler === "string"
                ) {

                    const rate =
                        Number(
                            journey.recyclerRate
                        ) || 0;

                    const value =
                        Number(
                            journey.finalRecyclerValue
                        ) ||
                        Number(
                            journey.recyclerValue
                        ) ||
                        (rate * weight);

                    journey.recycler = {
                        name:
                            journey.recycler,

                        rate:
                            rate,

                        estimated_value:
                            value,

                        estimatedValue:
                            value,

                        distance:
                            journey.recyclerDistance ||
                            "Distance unavailable",

                        rating:
                            Number(
                                journey.recyclerRating
                            ) || 0,

                        authorization:
                            "Verified",

                        pickup:
                            false
                    };

                    journey.recyclerRate =
                        rate;
                }

            }
        );
    }


    // ----------------------------------------------------------
    // PATCH RECYCLER SELECTION
    // ----------------------------------------------------------

    const originalSelectRecycler =
        window.selectRecyclerForHandover;


    if (
        typeof originalSelectRecycler ===
        "function"
    ) {

        window.selectRecyclerForHandover =
            async function (index) {

                await originalSelectRecycler(index);


                // Fix the active handover immediately
                if (
                    typeof activeHandover !==
                    "undefined" &&
                    activeHandover &&
                    activeHandover.recycler
                ) {

                    const weight =
                        Number(
                            activeHandover.weight
                        ) || 0;

                    const normalized =
                        normalizeRecycler(
                            activeHandover.recycler,
                            weight
                        );

                    activeHandover.recycler =
                        normalized;

                    activeHandover.recyclerRate =
                        normalized.rate;

                    activeHandover.value =
                        normalized.estimated_value;

                    console.log(
                        "✅ Step 4B: Active recycler normalized"
                    );

                    console.log(
                        "Recycler:",
                        normalized.name
                    );

                    console.log(
                        "Rate:",
                        normalized.rate
                    );

                    console.log(
                        "Value:",
                        normalized.estimated_value
                    );
                }


                // Fix journey immediately if it already exists
                fixJourneyRecyclerData();

            };

    } else {

        console.warn(
            "Step 4B: selectRecyclerForHandover() not found."
        );

    }


    // ----------------------------------------------------------
    // PATCH STEP 1E DATA
    // ----------------------------------------------------------

    function repairCurrentJourney() {

        if (
            typeof activeHandover ===
            "undefined" ||
            !activeHandover
        ) {
            return;
        }

        if (
            typeof wasteJourneyTransactions ===
            "undefined"
        ) {
            return;
        }


        const weight =
            Number(
                activeHandover.weight
            ) || 0;


        const handoverId =
            activeHandover.id ||
            activeHandover.handoverId;


        let journey =
            wasteJourneyTransactions.find(
                function (item) {

                    if (!item) {
                        return false;
                    }

                    if (
                        handoverId &&
                        (
                            item.handoverId ===
                            handoverId
                        )
                    ) {
                        return true;
                    }

                    return (
                        item.material ===
                            activeHandover.material &&
                        Number(
                            item.actualWeight
                        ) === weight
                    );
                }
            );


        if (!journey) {
            return;
        }


        // Normalize recycler
        if (
            activeHandover.recycler
        ) {

            const normalized =
                normalizeRecycler(
                    activeHandover.recycler,
                    weight
                );

            journey.recycler =
                normalized;

            journey.recyclerRate =
                normalized.rate;


            if (
                normalized.estimated_value >
                0
            ) {

                journey.finalRecyclerValue =
                    normalized.estimated_value;
            }


            console.log(
                "✅ Step 4B: Journey recycler data repaired"
            );

            console.log(
                "Transaction:",
                journey.id
            );

            console.log(
                "Recycler:",
                normalized.name
            );

            console.log(
                "Recycler Rate:",
                normalized.rate
            );

            console.log(
                "Recycler Value:",
                normalized.estimated_value
            );
        }

    }


    // ----------------------------------------------------------
    // PATCH EXISTING RECYCLER RATE HELPER
    // ----------------------------------------------------------

    window.getFixedRecyclerRate =
        function (journey) {

            if (!journey) {
                return 0;
            }


            // Recycler object
            if (
                journey.recycler &&
                typeof journey.recycler ===
                    "object"
            ) {

                const objectRate =
                    Number(
                        journey.recycler.rate
                    ) || 0;

                if (objectRate > 0) {
                    return objectRate;
                }
            }


            // Stored journey rate
            const journeyRate =
                Number(
                    journey.recyclerRate
                ) || 0;

            if (journeyRate > 0) {
                return journeyRate;
            }


            return 0;
        };


    // ----------------------------------------------------------
    // PATCH EXISTING RECYCLER VALUE HELPER
    // ----------------------------------------------------------

    window.getFixedRecyclerValue =
        function (journey) {

            if (!journey) {
                return 0;
            }


            // Final saved value
            const finalValue =
                Number(
                    journey.finalRecyclerValue
                ) || 0;

            if (finalValue > 0) {
                return finalValue;
            }


            // Recycler object value
            if (
                journey.recycler &&
                typeof journey.recycler ===
                    "object"
            ) {

                const objectValue =
                    Number(
                        journey.recycler
                            .estimated_value
                    ) || 0;

                if (objectValue > 0) {
                    return objectValue;
                }
            }


            // Calculate rate × weight
            const rate =
                window.getFixedRecyclerRate(
                    journey
                );

            const weight =
                Number(
                    journey.finalWeight ||
                    journey.actualWeight ||
                    journey.estimatedWeight
                ) || 0;


            return (
                rate * weight
            );
        };


    // ----------------------------------------------------------
    // REPAIR WHEN JOURNEY PANEL IS RENDERED
    // ----------------------------------------------------------

    const originalRenderJourney =
        window.renderWasteJourneyTracking;


    if (
        typeof originalRenderJourney ===
        "function"
    ) {

        window.renderWasteJourneyTracking =
            function () {

                fixJourneyRecyclerData();

                repairCurrentJourney();

                originalRenderJourney();

            };

    }


    // ----------------------------------------------------------
    // INITIAL REPAIR
    // ----------------------------------------------------------

    setTimeout(
        function () {

            fixJourneyRecyclerData();

            repairCurrentJourney();

            if (
                typeof window.renderWasteJourneyTracking ===
                "function"
            ) {

                window.renderWasteJourneyTracking();

            }

            console.log(
                "✅ Step 4B - Recycler rate/value synchronization complete."
            );

        },
        700
    );


})();

// ============================================================
// STEP 5A - LIVE DASHBOARD STATISTICS
// ============================================================

(function () {

    console.log("🚀 Step 5A - Live dashboard statistics loaded.");

    function getTransactions() {
        if (typeof wasteJourneyTransactions !== "undefined" &&
            Array.isArray(wasteJourneyTransactions)) {
            return wasteJourneyTransactions;
        }

        return [];
    }

    function getWeight(journey) {
        return Number(
            journey.finalWeight ||
            journey.actualWeight ||
            journey.collectedWeight ||
            journey.weight ||
            0
        ) || 0;
    }

    function getRecyclerValue(journey) {

        if (typeof window.getFixedRecyclerValue === "function") {
            const fixedValue = Number(
                window.getFixedRecyclerValue(journey)
            ) || 0;

            if (fixedValue > 0) {
                return fixedValue;
            }
        }

        const finalValue = Number(journey.finalRecyclerValue) || 0;

        if (finalValue > 0) {
            return finalValue;
        }

        if (journey.recycler &&
            typeof journey.recycler === "object") {

            const objectValue = Number(
                journey.recycler.estimated_value ||
                journey.recycler.estimatedValue ||
                journey.recycler.value ||
                0
            ) || 0;

            if (objectValue > 0) {
                return objectValue;
            }
        }

        const rate = Number(
            journey.recyclerRate ||
            0
        ) || 0;

        return rate * getWeight(journey);
    }

    function isCompleted(journey) {

        if (!journey) return false;

        const status = String(
            journey.status ||
            journey.journeyStatus ||
            ""
        ).toLowerCase();

        return (
            status.includes("completed") ||
            status.includes("recycling completed") ||
            journey.recyclingCompleted === true ||
            journey.recyclerConfirmed === true ||
            journey.status === "recycler_confirmed"
        );
    }

    function findDashboardNumber(labels) {

        const elements = document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6, p, span, div, strong"
        );

        for (const element of elements) {

            const text = String(
                element.textContent || ""
            ).trim().toLowerCase();

            for (const label of labels) {

                if (text === label.toLowerCase()) {

                    const parent = element.parentElement;

                    if (parent) {

                        const numberElement =
                            parent.querySelector(
                                ".stat-number, .stat-value, .dashboard-number, .value, strong"
                            );

                        if (numberElement &&
                            numberElement !== element) {

                            return numberElement;
                        }
                    }
                }
            }
        }

        return null;
    }

    function updateElementByIdOrLabel(
        ids,
        labels,
        value
    ) {

        for (const id of ids) {

            const element = document.getElementById(id);

            if (element) {
                element.textContent = value;
                return true;
            }
        }

        const labelElement =
            findDashboardNumber(labels);

        if (labelElement) {
            labelElement.textContent = value;
            return true;
        }

        return false;
    }

    function calculateDashboardStats() {

        const transactions = getTransactions();

        let totalCollectedWeight = 0;
        let totalRecycledWeight = 0;
        let totalValue = 0;
        let completedTransactions = 0;

        transactions.forEach(function (journey) {

            if (!journey) return;

            const weight = getWeight(journey);

            totalCollectedWeight += weight;

            if (isCompleted(journey)) {

                totalRecycledWeight += weight;

                totalValue += getRecyclerValue(journey);

                completedTransactions++;
            }
        });

        return {
            totalCollectedWeight,
            totalRecycledWeight,
            completedTransactions,
            totalValue
        };
    }

    function formatWeight(weight) {

        const number = Number(weight) || 0;

        if (Number.isInteger(number)) {
            return `${number} kg`;
        }

        return `${number.toFixed(2)} kg`;
    }

    function formatCurrency(value) {

        const number = Number(value) || 0;

        return "₹" + number.toLocaleString("en-IN", {
            maximumFractionDigits: 0
        });
    }

    function updateDashboardStats() {

        const stats = calculateDashboardStats();

        // Try common IDs first.
        updateElementByIdOrLabel(
            [
                "totalWasteCollected",
                "totalCollected",
                "dashboardTotalCollected"
            ],
            [
                "total waste collected",
                "waste collected",
                "total collected"
            ],
            formatWeight(stats.totalCollectedWeight)
        );

        updateElementByIdOrLabel(
            [
                "totalWasteRecycled",
                "totalRecycled",
                "dashboardTotalRecycled"
            ],
            [
                "total waste recycled",
                "waste recycled",
                "total recycled"
            ],
            formatWeight(stats.totalRecycledWeight)
        );

        updateElementByIdOrLabel(
            [
                "totalTransactions",
                "dashboardTotalTransactions"
            ],
            [
                "total transactions",
                "transactions"
            ],
            String(stats.completedTransactions)
        );

        updateElementByIdOrLabel(
            [
                "totalValueGenerated",
                "totalValue",
                "dashboardTotalValue"
            ],
            [
                "total value generated",
                "value generated",
                "total value"
            ],
            formatCurrency(stats.totalValue)
        );

        console.log("📊 STEP 5A DASHBOARD STATS");
        console.log("Total collected:", formatWeight(stats.totalCollectedWeight));
        console.log("Total recycled:", formatWeight(stats.totalRecycledWeight));
        console.log("Completed transactions:", stats.completedTransactions);
        console.log("Total value:", formatCurrency(stats.totalValue));
    }

    // Expose for debugging and future dashboard modules.
    window.updateKabadiSetuDashboardStats =
        updateDashboardStats;

    window.getKabadiSetuDashboardStats =
        calculateDashboardStats;

    // Initial update.
    setTimeout(function () {
        updateDashboardStats();
    }, 1000);

    // Keep dashboard synchronized with journey changes.
    setInterval(function () {
        updateDashboardStats();
    }, 1500);

    console.log(
        "✅ Step 5A - Dashboard statistics synchronization active."
    );

})();

// ============================================================
// STEP 5B - WASTE CATEGORY ANALYTICS
// ============================================================

(function () {

    console.log("🚀 Step 5B - Waste category analytics loaded.");

    // --------------------------------------------------------
    // GET ALL JOURNEYS
    // --------------------------------------------------------

    function getWasteJourneys() {

        if (
            typeof wasteJourneyTransactions !== "undefined" &&
            Array.isArray(wasteJourneyTransactions)
        ) {
            return wasteJourneyTransactions;
        }

        try {

            const saved =
                localStorage.getItem(
                    "kabadiSetuWasteJourneyTransactions"
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

            }

        } catch (error) {

            console.warn(
                "Step 5B: Could not read saved journeys.",
                error
            );

        }

        return [];
    }


    // --------------------------------------------------------
    // GET WEIGHT
    // --------------------------------------------------------

    function getJourneyWeight(journey) {

        if (!journey) {
            return 0;
        }

        const possibleWeights = [

            journey.finalWeight,

            journey.actualWeight,

            journey.estimatedWeight,

            journey.weight

        ];

        for (
            let i = 0;
            i < possibleWeights.length;
            i++
        ) {

            const weight =
                Number(
                    possibleWeights[i]
                );

            if (
                Number.isFinite(weight) &&
                weight > 0
            ) {

                return weight;

            }

        }

        return 0;
    }


    // --------------------------------------------------------
    // GET MATERIAL / CATEGORY
    // --------------------------------------------------------

    function getJourneyMaterial(journey) {

        if (!journey) {
            return "Other";
        }

        const material =
            journey.material ||
            journey.category ||
            journey.wasteCategory ||
            "Other";

        return String(material).trim() || "Other";
    }


    // --------------------------------------------------------
    // CALCULATE CATEGORY DATA
    // --------------------------------------------------------

    function calculateWasteCategoryAnalytics() {

        const journeys =
            getWasteJourneys();

        const categories = {};

        journeys.forEach(
            function (journey) {

                if (!journey) {
                    return;
                }

                const material =
                    getJourneyMaterial(
                        journey
                    );

                const weight =
                    getJourneyWeight(
                        journey
                    );

                if (!categories[material]) {

                    categories[material] = {

                        material: material,

                        weight: 0,

                        transactions: 0

                    };

                }

                categories[material].weight +=
                    weight;

                categories[material].transactions +=
                    1;

            }
        );


        const result =
            Object.values(categories)
                .sort(
                    function (a, b) {

                        return (
                            b.weight -
                            a.weight
                        );

                    }
                );


        return result;
    }


    // --------------------------------------------------------
    // FORMAT WEIGHT
    // --------------------------------------------------------

    function formatAnalyticsWeight(weight) {

        const number =
            Number(weight) || 0;

        if (
            Number.isInteger(number)
        ) {

            return number + " kg";

        }

        return (
            number.toFixed(2) +
            " kg"
        );

    }


    // --------------------------------------------------------
    // CATEGORY ICON
    // --------------------------------------------------------

    function getCategoryIcon(material) {

        const value =
            String(material)
                .toLowerCase();

        if (
            value.includes("plastic")
        ) {
            return "🧴";
        }

        if (
            value.includes("copper")
        ) {
            return "🔶";
        }

        if (
            value.includes("aluminium") ||
            value.includes("aluminum")
        ) {
            return "🥫";
        }

        if (
            value.includes("iron")
        ) {
            return "🔩";
        }

        if (
            value.includes("steel")
        ) {
            return "⚙️";
        }

        if (
            value.includes("glass")
        ) {
            return "🫙";
        }

        if (
            value.includes("paper") ||
            value.includes("book") ||
            value.includes("newspaper")
        ) {
            return "📚";
        }

        if (
            value.includes("battery") ||
            value.includes("lithium")
        ) {
            return "🔋";
        }

        if (
            value.includes("pcb") ||
            value.includes("circuit")
        ) {
            return "💻";
        }

        if (
            value.includes("mobile") ||
            value.includes("phone")
        ) {
            return "📱";
        }

        if (
            value.includes("laptop")
        ) {
            return "💻";
        }

        if (
            value.includes("display") ||
            value.includes("lcd")
        ) {
            return "🖥️";
        }

        if (
            value.includes("motor")
        ) {
            return "⚙️";
        }

        if (
            value.includes("e-waste") ||
            value.includes("ewaste")
        ) {
            return "♻️";
        }

        return "♻️";
    }


    // --------------------------------------------------------
    // RENDER CATEGORY ANALYTICS
    // --------------------------------------------------------

    function renderWasteCategoryAnalytics() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (!dashboard) {
            return;
        }


        let card =
            document.getElementById(
                "wasteCategoryAnalyticsCard"
            );


        if (!card) {

            card =
                document.createElement(
                    "div"
                );

            card.id =
                "wasteCategoryAnalyticsCard";

            dashboard.appendChild(
                card
            );

        }


        const analytics =
            calculateWasteCategoryAnalytics();


        // ----------------------------------------------------
        // EMPTY STATE
        // ----------------------------------------------------

        if (
            analytics.length === 0
        ) {

            card.innerHTML = "";

            return;

        }


        // ----------------------------------------------------
        // TOTAL WEIGHT
        // ----------------------------------------------------

        const totalWeight =
            analytics.reduce(
                function (total, item) {

                    return (
                        total +
                        Number(item.weight || 0)
                    );

                },
                0
            );


        const maxWeight =
            analytics.length > 0
                ? Math.max(
                    ...analytics.map(
                        function (item) {
                            return Number(
                                item.weight
                            ) || 0;
                        }
                    )
                )
                : 0;


        // ----------------------------------------------------
        // CATEGORY ROWS
        // ----------------------------------------------------

        const rows =
            analytics.map(
                function (item) {

                    const percentage =
                        totalWeight > 0
                            ? (
                                Number(
                                    item.weight
                                ) /
                                totalWeight
                            ) * 100
                            : 0;


                    const barWidth =
                        maxWeight > 0
                            ? (
                                Number(
                                    item.weight
                                ) /
                                maxWeight
                            ) * 100
                            : 0;


                    return `

                        <div
                            style="
                                padding:14px;
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                                background:#ffffff;
                                margin-bottom:10px;
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:12px;
                                    margin-bottom:8px;
                                "
                            >

                                <div
                                    style="
                                        display:flex;
                                        align-items:center;
                                        gap:9px;
                                        min-width:0;
                                    "
                                >

                                    <span
                                        style="
                                            font-size:21px;
                                        "
                                    >
                                        ${getCategoryIcon(
                                            item.material
                                        )}
                                    </span>

                                    <strong
                                        style="
                                            font-size:14px;
                                            color:#111827;
                                        "
                                    >
                                        ${item.material}
                                    </strong>

                                </div>


                                <div
                                    style="
                                        text-align:right;
                                        white-space:nowrap;
                                    "
                                >

                                    <strong
                                        style="
                                            font-size:15px;
                                            color:#159570;
                                        "
                                    >
                                        ${formatAnalyticsWeight(
                                            item.weight
                                        )}
                                    </strong>

                                    <div
                                        style="
                                            font-size:11px;
                                            color:#6b7280;
                                            margin-top:2px;
                                        "
                                    >
                                        ${percentage.toFixed(1)}%
                                    </div>

                                </div>

                            </div>


                            <div
                                style="
                                    width:100%;
                                    height:8px;
                                    background:#e5e7eb;
                                    border-radius:999px;
                                    overflow:hidden;
                                "
                            >

                                <div
                                    style="
                                        width:${Math.max(
                                            2,
                                            barWidth
                                        )}%;
                                        height:100%;
                                        background:#159570;
                                        border-radius:999px;
                                        transition:width 0.4s ease;
                                    "
                                ></div>

                            </div>


                            <div
                                style="
                                    margin-top:7px;
                                    font-size:11px;
                                    color:#6b7280;
                                "
                            >
                                ${item.transactions}
                                ${item.transactions === 1
                                    ? "transaction"
                                    : "transactions"}
                            </div>

                        </div>

                    `;

                }
            ).join("");


        // ----------------------------------------------------
        // FINAL CARD
        // ----------------------------------------------------

        card.innerHTML = `

            <div
                style="
                    background:#ffffff;
                    border:1px solid #e5e7eb;
                    border-radius:18px;
                    padding:22px;
                    margin-top:22px;
                    box-shadow:0 4px 14px rgba(0,0,0,0.05);
                "
            >

                <!-- HEADER -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:15px;
                        margin-bottom:18px;
                    "
                >

                    <div>

                        <div
                            style="
                                font-size:19px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            ♻️ Waste Category Breakdown
                        </div>

                        <div
                            style="
                                margin-top:5px;
                                font-size:13px;
                                color:#6b7280;
                            "
                        >
                            Material collected across your waste journeys
                        </div>

                    </div>


                    <div
                        style="
                            text-align:right;
                            white-space:nowrap;
                        "
                    >

                        <div
                            style="
                                font-size:11px;
                                color:#6b7280;
                                font-weight:700;
                            "
                        >
                            TOTAL WASTE
                        </div>

                        <strong
                            style="
                                display:block;
                                margin-top:2px;
                                font-size:18px;
                                color:#159570;
                            "
                        >
                            ${formatAnalyticsWeight(
                                totalWeight
                            )}
                        </strong>

                    </div>

                </div>


                <!-- CATEGORY LIST -->

                <div>
                    ${rows}
                </div>


                <!-- FOOTER -->

                <div
                    style="
                        margin-top:14px;
                        padding-top:13px;
                        border-top:1px solid #f1f5f9;
                        font-size:11px;
                        color:#6b7280;
                    "
                >
                    Data is calculated from recorded waste journey transactions.
                </div>

            </div>

        `;

    }


    // --------------------------------------------------------
    // GLOBAL ACCESS
    // --------------------------------------------------------

    window.calculateWasteCategoryAnalytics =
        calculateWasteCategoryAnalytics;


    window.renderWasteCategoryAnalytics =
        renderWasteCategoryAnalytics;


    // --------------------------------------------------------
    // INITIAL RENDER
    // --------------------------------------------------------

    setTimeout(
        function () {

            renderWasteCategoryAnalytics();

        },
        900
    );


    // --------------------------------------------------------
    // REFRESH WHEN DASHBOARD OPENS
    // --------------------------------------------------------

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".nav-item"
                );

            if (!button) {
                return;
            }


            if (
                button.innerText
                    .toLowerCase()
                    .includes("dashboard")
            ) {

                setTimeout(
                    function () {

                        renderWasteCategoryAnalytics();

                    },
                    250
                );

            }

        }
    );


    // --------------------------------------------------------
    // KEEP ANALYTICS LIVE
    // --------------------------------------------------------

    setInterval(
        function () {

            if (
                Array.isArray(
                    getWasteJourneys()
                )
            ) {

                renderWasteCategoryAnalytics();

            }

        },
        1500
    );


    console.log(
        "✅ Step 5B - Waste category analytics active."
    );

})();

// ============================================================
// STEP 5C - RECENT TRANSACTIONS
// ============================================================

(function () {

    console.log("🚀 Step 5C - Recent Transactions loaded.");

    function getTransactions() {

        if (
            typeof wasteJourneyTransactions !== "undefined" &&
            Array.isArray(wasteJourneyTransactions)
        ) {
            return wasteJourneyTransactions;
        }

        try {

            const saved =
                localStorage.getItem(
                    "kabadiSetuWasteJourneyTransactions"
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

            }

        } catch (error) {

            console.warn(
                "Step 5C: Could not read transactions.",
                error
            );

        }

        return [];

    }


    function getTransactionWeight(transaction) {

        if (!transaction) {
            return 0;
        }

        const weights = [
            transaction.finalWeight,
            transaction.actualWeight,
            transaction.estimatedWeight,
            transaction.weight
        ];

        for (
            let i = 0;
            i < weights.length;
            i++
        ) {

            const weight =
                Number(weights[i]);

            if (
                Number.isFinite(weight) &&
                weight > 0
            ) {

                return weight;

            }

        }

        return 0;

    }


    function getTransactionValue(transaction) {

        if (!transaction) {
            return 0;
        }

        const possibleValues = [

            transaction.finalRecyclerValue,

            transaction.recyclerValue,

            transaction.finalValue,

            transaction.value,

            transaction.estimatedValue

        ];

        for (
            let i = 0;
            i < possibleValues.length;
            i++
        ) {

            const value =
                Number(
                    possibleValues[i]
                );

            if (
                Number.isFinite(value) &&
                value > 0
            ) {

                return value;

            }

        }


        let rate = 0;

        if (
            transaction.recycler &&
            typeof transaction.recycler === "object"
        ) {

            rate =
                Number(
                    transaction.recycler.rate
                ) || 0;

        }


        if (!rate) {

            rate =
                Number(
                    transaction.recyclerRate
                ) || 0;

        }


        const weight =
            getTransactionWeight(
                transaction
            );


        return rate * weight;

    }


    function getTransactionMaterial(transaction) {

        if (!transaction) {
            return "Unknown Material";
        }

        return String(
            transaction.material ||
            transaction.category ||
            transaction.wasteCategory ||
            "Unknown Material"
        ).trim();

    }


    function getTransactionRecycler(transaction) {

        if (!transaction) {
            return "Recycler not recorded";
        }


        if (
            transaction.recycler &&
            typeof transaction.recycler === "object"
        ) {

            return (
                transaction.recycler.name ||
                "Recycler not recorded"
            );

        }


        if (transaction.recycler) {

            return String(
                transaction.recycler
            );

        }


        return "Recycler not recorded";

    }


    function getTransactionId(transaction) {

        if (!transaction) {
            return "KS-TXN-UNKNOWN";
        }

        return (
            transaction.id ||
            transaction.transactionId ||
            "KS-TXN-UNKNOWN"
        );

    }


    function getTransactionStatus(transaction) {

        if (!transaction) {
            return "Transaction Recorded";
        }


        const status =
            String(
                transaction.status ||
                transaction.journeyStatus ||
                transaction.currentStep ||
                ""
            ).toLowerCase();


        if (
            status.includes("complete") ||
            status.includes("recycl")
        ) {

            return "Recycling Completed";

        }


        if (
            transaction.recyclerConfirmed ||
            transaction.receiptConfirmed ||
            transaction.recyclingCompleted
        ) {

            return "Recycling Completed";

        }


        if (
            transaction.handoverId
        ) {

            return "Handover Prepared";

        }


        return "Transaction Recorded";

    }


    function getTransactionDate(transaction) {

        if (!transaction) {
            return "";
        }


        const possibleDates = [

            transaction.completedAt,

            transaction.confirmedAt,

            transaction.createdAt,

            transaction.timestamp,

            transaction.date

        ];


        for (
            let i = 0;
            i < possibleDates.length;
            i++
        ) {

            if (!possibleDates[i]) {
                continue;
            }


            const date =
                new Date(
                    possibleDates[i]
                );


            if (
                !Number.isNaN(
                    date.getTime()
                )
            ) {

                return date.toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            }

        }


        return "";

    }


    function getStatusIcon(status) {

        const value =
            String(status)
                .toLowerCase();


        if (
            value.includes("complete")
        ) {

            return "♻️";

        }


        if (
            value.includes("handover")
        ) {

            return "📦";

        }


        return "🧾";

    }


    function getMaterialIcon(material) {

        const value =
            String(material)
                .toLowerCase();


        if (
            value.includes("plastic")
        ) {
            return "🧴";
        }


        if (
            value.includes("copper")
        ) {
            return "🔶";
        }


        if (
            value.includes("aluminium") ||
            value.includes("aluminum")
        ) {
            return "🥫";
        }


        if (
            value.includes("iron")
        ) {
            return "🔩";
        }


        if (
            value.includes("steel")
        ) {
            return "⚙️";
        }


        if (
            value.includes("glass")
        ) {
            return "🫙";
        }


        if (
            value.includes("book") ||
            value.includes("paper") ||
            value.includes("newspaper")
        ) {
            return "📚";
        }


        if (
            value.includes("battery") ||
            value.includes("lithium")
        ) {
            return "🔋";
        }


        if (
            value.includes("pcb") ||
            value.includes("circuit")
        ) {
            return "💻";
        }


        if (
            value.includes("mobile") ||
            value.includes("phone")
        ) {
            return "📱";
        }


        if (
            value.includes("laptop")
        ) {
            return "💻";
        }


        if (
            value.includes("display") ||
            value.includes("lcd")
        ) {
            return "🖥️";
        }


        if (
            value.includes("motor")
        ) {
            return "⚙️";
        }


        if (
            value.includes("e-waste") ||
            value.includes("ewaste")
        ) {
            return "♻️";
        }


        return "♻️";

    }


    function renderRecentTransactions() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (!dashboard) {
            return;
        }


        let card =
            document.getElementById(
                "recentTransactionsCard"
            );


        if (!card) {

            card =
                document.createElement(
                    "div"
                );

            card.id =
                "recentTransactionsCard";

            dashboard.appendChild(
                card
            );

        }


        const transactions =
            getTransactions();


        if (
            transactions.length === 0
        ) {

            card.innerHTML = `

                <div
                    style="
                        background:#ffffff;
                        border:1px solid #e5e7eb;
                        border-radius:18px;
                        padding:22px;
                        margin-top:22px;
                        box-shadow:0 4px 14px rgba(0,0,0,0.05);
                    "
                >

                    <div
                        style="
                            font-size:19px;
                            font-weight:800;
                            color:#111827;
                        "
                    >
                        🧾 Recent Transactions
                    </div>

                    <div
                        style="
                            margin-top:8px;
                            font-size:13px;
                            color:#6b7280;
                        "
                    >
                        Your completed waste transactions will appear here.
                    </div>

                </div>

            `;

            return;

        }


        const recentTransactions =
            transactions
                .slice()
                .reverse()
                .slice(0, 5);


        const rows =
            recentTransactions
                .map(
                    function (transaction) {

                        const material =
                            getTransactionMaterial(
                                transaction
                            );


                        const weight =
                            getTransactionWeight(
                                transaction
                            );


                        const value =
                            getTransactionValue(
                                transaction
                            );


                        const recycler =
                            getTransactionRecycler(
                                transaction
                            );


                        const transactionId =
                            getTransactionId(
                                transaction
                            );


                        const status =
                            getTransactionStatus(
                                transaction
                            );


                        const date =
                            getTransactionDate(
                                transaction
                            );


                        const materialIcon =
                            getMaterialIcon(
                                material
                            );


                        const statusIcon =
                            getStatusIcon(
                                status
                            );


                        return `

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:18px;
                                    padding:16px 0;
                                    border-bottom:1px solid #f1f5f9;
                                "
                            >

                                <div
                                    style="
                                        display:flex;
                                        align-items:center;
                                        gap:12px;
                                        min-width:0;
                                        flex:1;
                                    "
                                >

                                    <div
                                        style="
                                            width:44px;
                                            height:44px;
                                            border-radius:12px;
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            background:#f0fdf4;
                                            font-size:22px;
                                            flex-shrink:0;
                                        "
                                    >
                                        ${materialIcon}
                                    </div>


                                    <div
                                        style="
                                            min-width:0;
                                        "
                                    >

                                        <div
                                            style="
                                                font-size:14px;
                                                font-weight:800;
                                                color:#111827;
                                                word-break:break-word;
                                            "
                                        >
                                            ${material}
                                        </div>


                                        <div
                                            style="
                                                margin-top:4px;
                                                font-size:11px;
                                                color:#6b7280;
                                            "
                                        >
                                            ${transactionId}
                                        </div>


                                        <div
                                            style="
                                                margin-top:4px;
                                                font-size:12px;
                                                color:#6b7280;
                                            "
                                        >
                                            ${weight > 0
                                                ? weight + " kg"
                                                : "Weight not recorded"}
                                            •
                                            ${recycler}
                                        </div>


                                        ${
                                            date
                                                ? `
                                                    <div
                                                        style="
                                                            margin-top:3px;
                                                            font-size:11px;
                                                            color:#9ca3af;
                                                        "
                                                    >
                                                        ${date}
                                                    </div>
                                                `
                                                : ""
                                        }

                                    </div>

                                </div>


                                <div
                                    style="
                                        text-align:right;
                                        flex-shrink:0;
                                    "
                                >

                                    <div
                                        style="
                                            font-size:17px;
                                            font-weight:800;
                                            color:#159570;
                                            white-space:nowrap;
                                        "
                                    >
                                        ₹${Math.round(
                                            value
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </div>


                                    <div
                                        style="
                                            margin-top:5px;
                                            font-size:11px;
                                            font-weight:700;
                                            color:#15803d;
                                            white-space:nowrap;
                                        "
                                    >
                                        ${statusIcon}
                                        ${status}
                                    </div>

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");


        card.innerHTML = `

            <div
                style="
                    background:#ffffff;
                    border:1px solid #e5e7eb;
                    border-radius:18px;
                    padding:22px;
                    margin-top:22px;
                    box-shadow:0 4px 14px rgba(0,0,0,0.05);
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:15px;
                        margin-bottom:5px;
                    "
                >

                    <div>

                        <div
                            style="
                                font-size:19px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            🧾 Recent Transactions
                        </div>


                        <div
                            style="
                                margin-top:5px;
                                font-size:13px;
                                color:#6b7280;
                            "
                        >
                            Latest waste transactions recorded on Kabadi Setu
                        </div>

                    </div>


                    <div
                        style="
                            padding:6px 10px;
                            border-radius:999px;
                            background:#f0fdf4;
                            color:#15803d;
                            font-size:11px;
                            font-weight:800;
                            white-space:nowrap;
                        "
                    >
                        ${transactions.length}
                        ${
                            transactions.length === 1
                                ? " TRANSACTION"
                                : " TRANSACTIONS"
                        }
                    </div>

                </div>


                <div>
                    ${rows}
                </div>


                <div
                    style="
                        margin-top:14px;
                        padding-top:13px;
                        border-top:1px solid #f1f5f9;
                        font-size:11px;
                        color:#6b7280;
                    "
                >
                    Showing the latest 5 transactions.
                </div>

            </div>

        `;

    }


    window.renderRecentTransactions =
        renderRecentTransactions;


    window.getKabadiSetuTransactions =
        getTransactions;


    // Initial render
    setTimeout(
        function () {

            renderRecentTransactions();

        },
        1100
    );


    // Refresh when Dashboard is opened
    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".nav-item"
                );


            if (!button) {
                return;
            }


            if (
                button.innerText
                    .toLowerCase()
                    .includes("dashboard")
            ) {

                setTimeout(
                    function () {

                        renderRecentTransactions();

                    },
                    300
                );

            }

        }
    );


    // Keep transaction list synchronized
    setInterval(
        function () {

            renderRecentTransactions();

        },
        1500
    );


    console.log(
        "✅ Step 5C - Recent Transactions active."
    );

})();

// ============================================================
// STEP 5D - TRANSACTION DETAILS + TRACEABILITY
// ============================================================

(function () {

    console.log("🚀 Step 5D - Transaction Details loaded.");

    function getTransactions() {

        if (
            typeof wasteJourneyTransactions !== "undefined" &&
            Array.isArray(wasteJourneyTransactions)
        ) {
            return wasteJourneyTransactions;
        }

        try {

            const saved =
                localStorage.getItem(
                    "kabadiSetuWasteJourneyTransactions"
                );

            if (saved) {

                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

            }

        } catch (error) {

            console.warn(
                "Step 5D: Could not read transactions.",
                error
            );

        }

        return [];

    }


    function getWeight(transaction) {

        if (!transaction) {
            return 0;
        }

        const values = [
            transaction.finalWeight,
            transaction.actualWeight,
            transaction.estimatedWeight,
            transaction.weight
        ];

        for (let i = 0; i < values.length; i++) {

            const weight =
                Number(values[i]);

            if (
                Number.isFinite(weight) &&
                weight > 0
            ) {
                return weight;
            }

        }

        return 0;

    }


    function getRecycler(transaction) {

        if (!transaction) {
            return null;
        }

        if (
            transaction.recycler &&
            typeof transaction.recycler === "object"
        ) {

            return transaction.recycler;

        }

        return {
            name:
                transaction.recycler ||
                "Recycler not recorded",

            rate:
                Number(transaction.recyclerRate) || 0,

            estimated_value:
                Number(
                    transaction.finalRecyclerValue ||
                    transaction.recyclerValue ||
                    transaction.value ||
                    0
                ),

            distance:
                transaction.recyclerDistance ||
                "Not recorded",

            rating:
                Number(
                    transaction.recyclerRating
                ) || 0,

            authorization:
                "Verified"

        };

    }


    function getValue(transaction) {

        if (!transaction) {
            return 0;
        }

        const recycler =
            getRecycler(transaction);

        const directValues = [
            transaction.finalRecyclerValue,
            transaction.recyclerValue,
            transaction.finalValue,
            transaction.value,
            transaction.estimatedValue
        ];

        for (
            let i = 0;
            i < directValues.length;
            i++
        ) {

            const value =
                Number(directValues[i]);

            if (
                Number.isFinite(value) &&
                value > 0
            ) {

                return value;

            }

        }

        if (recycler) {

            const recyclerValue =
                Number(
                    recycler.estimated_value
                );

            if (
                Number.isFinite(recyclerValue) &&
                recyclerValue > 0
            ) {

                return recyclerValue;

            }

            const rate =
                Number(recycler.rate) || 0;

            const weight =
                getWeight(transaction);

            return rate * weight;

        }

        return 0;

    }


    function getMaterial(transaction) {

        return String(
            transaction.material ||
            transaction.category ||
            transaction.wasteCategory ||
            "Unknown Material"
        );

    }


    function getStatus(transaction) {

        if (!transaction) {
            return "Transaction Recorded";
        }

        const value =
            String(
                transaction.status ||
                transaction.journeyStatus ||
                ""
            ).toLowerCase();

        if (
            value.includes("complete") ||
            value.includes("recycl")
        ) {
            return "Recycling Completed";
        }

        if (
            transaction.recyclerConfirmed ||
            transaction.receiptConfirmed ||
            transaction.recyclingCompleted
        ) {
            return "Recycling Completed";
        }

        if (transaction.handoverId) {
            return "Handover Prepared";
        }

        return "Transaction Recorded";

    }


    function getDate(transaction) {

        const values = [
            transaction.completedAt,
            transaction.confirmedAt,
            transaction.createdAt,
            transaction.timestamp,
            transaction.date
        ];

        for (let i = 0; i < values.length; i++) {

            if (!values[i]) {
                continue;
            }

            const date =
                new Date(values[i]);

            if (
                !Number.isNaN(
                    date.getTime()
                )
            ) {

                return date.toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            }

        }

        return "Date not recorded";

    }


    function openTransactionDetails(transaction) {

        if (!transaction) {
            return;
        }

        const recycler =
            getRecycler(transaction);

        const material =
            getMaterial(transaction);

        const weight =
            getWeight(transaction);

        const value =
            getValue(transaction);

        const status =
            getStatus(transaction);

        const transactionId =
            transaction.id ||
            transaction.transactionId ||
            "KS-TXN-UNKNOWN";

        const handoverId =
            transaction.handoverId ||
            transaction.handoverID ||
            "Not generated";

        const token =
            transaction.token ||
            transaction.handoverToken ||
            "Not generated";

        const rate =
            recycler
                ? Number(recycler.rate) || 0
                : Number(transaction.recyclerRate) || 0;

        const recyclerName =
            recycler
                ? recycler.name || "Recycler not recorded"
                : "Recycler not recorded";

        const distance =
            recycler
                ? recycler.distance || "Not recorded"
                : "Not recorded";

        const rating =
            recycler
                ? Number(recycler.rating) || 0
                : 0;

        const authorization =
            recycler
                ? recycler.authorization || "Verified"
                : "Verified";

        const date =
            getDate(transaction);


        // Remove previous modal if present

        const oldModal =
            document.getElementById(
                "transactionDetailsModal"
            );

        if (oldModal) {
            oldModal.remove();
        }


        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "transactionDetailsModal";


        modal.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        `;


        modal.innerHTML = `

            <div
                style="
                    width:min(720px, 100%);
                    max-height:90vh;
                    overflow-y:auto;
                    background:#ffffff;
                    border-radius:22px;
                    box-shadow:0 20px 60px rgba(0,0,0,0.25);
                "
            >

                <!-- HEADER -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        padding:22px 24px;
                        border-bottom:1px solid #e5e7eb;
                    "
                >

                    <div>

                        <div
                            style="
                                font-size:20px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            ♻️ Transaction Details
                        </div>

                        <div
                            style="
                                margin-top:5px;
                                font-size:12px;
                                color:#6b7280;
                            "
                        >
                            ${transactionId}
                        </div>

                    </div>


                    <button
                        id="closeTransactionDetails"
                        style="
                            width:36px;
                            height:36px;
                            border:none;
                            border-radius:10px;
                            background:#f3f4f6;
                            color:#374151;
                            font-size:20px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>


                <!-- STATUS -->

                <div
                    style="
                        margin:20px 24px 0;
                        padding:13px 15px;
                        border-radius:12px;
                        background:#f0fdf4;
                        border:1px solid #bbf7d0;
                        color:#15803d;
                        font-size:13px;
                        font-weight:800;
                    "
                >
                    ✅ ${status}
                </div>


                <!-- BASIC DETAILS -->

                <div
                    style="
                        padding:22px 24px;
                    "
                >

                    <div
                        style="
                            display:grid;
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr));
                            gap:12px;
                        "
                    >

                        <div
                            style="
                                padding:15px;
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                            "
                        >

                            <div
                                style="
                                    font-size:11px;
                                    color:#6b7280;
                                    font-weight:700;
                                "
                            >
                                MATERIAL
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    font-size:16px;
                                    font-weight:800;
                                    color:#111827;
                                "
                            >
                                ${material}
                            </div>

                        </div>


                        <div
                            style="
                                padding:15px;
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                            "
                        >

                            <div
                                style="
                                    font-size:11px;
                                    color:#6b7280;
                                    font-weight:700;
                                "
                            >
                                ACTUAL WEIGHT
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    font-size:16px;
                                    font-weight:800;
                                    color:#111827;
                                "
                            >
                                ${weight > 0
                                    ? weight + " kg"
                                    : "Not recorded"}
                            </div>

                        </div>


                        <div
                            style="
                                padding:15px;
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                            "
                        >

                            <div
                                style="
                                    font-size:11px;
                                    color:#6b7280;
                                    font-weight:700;
                                "
                            >
                                RECYCLER RATE
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    font-size:16px;
                                    font-weight:800;
                                    color:#159570;
                                "
                            >
                                ₹${rate.toLocaleString(
                                    "en-IN"
                                )}/kg
                            </div>

                        </div>


                        <div
                            style="
                                padding:15px;
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                            "
                        >

                            <div
                                style="
                                    font-size:11px;
                                    color:#6b7280;
                                    font-weight:700;
                                "
                            >
                                FINAL VALUE
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    font-size:18px;
                                    font-weight:800;
                                    color:#159570;
                                "
                            >
                                ₹${Math.round(
                                    value
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </div>

                        </div>

                    </div>


                    <!-- RECYCLER -->

                    <div
                        style="
                            margin-top:18px;
                            padding:18px;
                            border-radius:16px;
                            background:#f8fafc;
                            border:1px solid #e5e7eb;
                        "
                    >

                        <div
                            style="
                                font-size:13px;
                                font-weight:800;
                                color:#111827;
                                margin-bottom:12px;
                            "
                        >
                            🏭 Recycler Information
                        </div>


                        <div
                            style="
                                font-size:15px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            ${recyclerName}
                        </div>


                        <div
                            style="
                                display:flex;
                                flex-wrap:wrap;
                                gap:10px;
                                margin-top:10px;
                            "
                        >

                            <span
                                style="
                                    padding:6px 9px;
                                    border-radius:999px;
                                    background:#dcfce7;
                                    color:#166534;
                                    font-size:11px;
                                    font-weight:700;
                                "
                            >
                                ✓ ${authorization}
                            </span>


                            <span
                                style="
                                    padding:6px 9px;
                                    border-radius:999px;
                                    background:#f3f4f6;
                                    color:#4b5563;
                                    font-size:11px;
                                    font-weight:700;
                                "
                            >
                                📍 ${distance}
                            </span>


                            ${
                                rating > 0
                                    ? `
                                        <span
                                            style="
                                                padding:6px 9px;
                                                border-radius:999px;
                                                background:#fef3c7;
                                                color:#92400e;
                                                font-size:11px;
                                                font-weight:700;
                                            "
                                        >
                                            ⭐ ${rating}
                                        </span>
                                    `
                                    : ""
                            }

                        </div>

                    </div>


                    <!-- TRACEABILITY -->

                    <div
                        style="
                            margin-top:22px;
                        "
                    >

                        <div
                            style="
                                font-size:16px;
                                font-weight:800;
                                color:#111827;
                                margin-bottom:15px;
                            "
                        >
                            🔗 Waste Journey Traceability
                        </div>


                        <div
                            style="
                                display:flex;
                                flex-direction:column;
                                gap:0;
                            "
                        >

                            <!-- HOUSEHOLD -->

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:13px;
                                "
                            >

                                <div
                                    style="
                                        width:42px;
                                        height:42px;
                                        border-radius:50%;
                                        background:#eff6ff;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:20px;
                                        flex-shrink:0;
                                    "
                                >
                                    🏠
                                </div>

                                <div>

                                    <div
                                        style="
                                            font-size:13px;
                                            font-weight:800;
                                            color:#111827;
                                        "
                                    >
                                        Household
                                    </div>

                                    <div
                                        style="
                                            font-size:11px;
                                            color:#6b7280;
                                        "
                                    >
                                        Waste submitted
                                    </div>

                                </div>

                            </div>


                            <div
                                style="
                                    margin-left:20px;
                                    width:2px;
                                    height:22px;
                                    background:#bbf7d0;
                                "
                            ></div>


                            <!-- AI -->

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:13px;
                                "
                            >

                                <div
                                    style="
                                        width:42px;
                                        height:42px;
                                        border-radius:50%;
                                        background:#f5f3ff;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:20px;
                                        flex-shrink:0;
                                    "
                                >
                                    🤖
                                </div>

                                <div>

                                    <div
                                        style="
                                            font-size:13px;
                                            font-weight:800;
                                            color:#111827;
                                        "
                                    >
                                        AI Classification
                                    </div>

                                    <div
                                        style="
                                            font-size:11px;
                                            color:#6b7280;
                                        "
                                    >
                                        Material category identified
                                    </div>

                                </div>

                            </div>


                            <div
                                style="
                                    margin-left:20px;
                                    width:2px;
                                    height:22px;
                                    background:#bbf7d0;
                                "
                            ></div>


                            <!-- WEIGHING -->

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:13px;
                                "
                            >

                                <div
                                    style="
                                        width:42px;
                                        height:42px;
                                        border-radius:50%;
                                        background:#fff7ed;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:20px;
                                        flex-shrink:0;
                                    "
                                >
                                    ⚖️
                                </div>

                                <div>

                                    <div
                                        style="
                                            font-size:13px;
                                            font-weight:800;
                                            color:#111827;
                                        "
                                    >
                                        Physical Weighing
                                    </div>

                                    <div
                                        style="
                                            font-size:11px;
                                            color:#6b7280;
                                        "
                                    >
                                        Final weight: ${
                                            weight > 0
                                                ? weight + " kg"
                                                : "Not recorded"
                                        }
                                    </div>

                                </div>

                            </div>


                            <div
                                style="
                                    margin-left:20px;
                                    width:2px;
                                    height:22px;
                                    background:#bbf7d0;
                                "
                            ></div>


                            <!-- COLLECTOR -->

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:13px;
                                "
                            >

                                <div
                                    style="
                                        width:42px;
                                        height:42px;
                                        border-radius:50%;
                                        background:#f0fdf4;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:20px;
                                        flex-shrink:0;
                                    "
                                >
                                    👤
                                </div>

                                <div>

                                    <div
                                        style="
                                            font-size:13px;
                                            font-weight:800;
                                            color:#111827;
                                        "
                                    >
                                        Informal Collector
                                    </div>

                                    <div
                                        style="
                                            font-size:11px;
                                            color:#6b7280;
                                        "
                                    >
                                        Collection and handover
                                    </div>

                                </div>

                            </div>


                            <div
                                style="
                                    margin-left:20px;
                                    width:2px;
                                    height:22px;
                                    background:#bbf7d0;
                                "
                            ></div>


                            <!-- RECYCLER -->

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:13px;
                                "
                            >

                                <div
                                    style="
                                        width:42px;
                                        height:42px;
                                        border-radius:50%;
                                        background:#ecfdf5;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:20px;
                                        flex-shrink:0;
                                    "
                                >
                                    🏭
                                </div>

                                <div>

                                    <div
                                        style="
                                            font-size:13px;
                                            font-weight:800;
                                            color:#111827;
                                        "
                                    >
                                        Authorized Recycler
                                    </div>

                                    <div
                                        style="
                                            font-size:11px;
                                            color:#6b7280;
                                        "
                                    >
                                        ${recyclerName}
                                    </div>

                                </div>

                            </div>


                            <div
                                style="
                                    margin-left:20px;
                                    width:2px;
                                    height:22px;
                                    background:#bbf7d0;
                                "
                            ></div>


                            <!-- COMPLETE -->

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:13px;
                                "
                            >

                                <div
                                    style="
                                        width:42px;
                                        height:42px;
                                        border-radius:50%;
                                        background:#dcfce7;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:20px;
                                        flex-shrink:0;
                                    "
                                >
                                    ♻️
                                </div>

                                <div>

                                    <div
                                        style="
                                            font-size:13px;
                                            font-weight:800;
                                            color:#15803d;
                                        "
                                    >
                                        Recycling Completed
                                    </div>

                                    <div
                                        style="
                                            font-size:11px;
                                            color:#6b7280;
                                        "
                                    >
                                        Waste journey completed
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    <!-- HANDOVER IDs -->

                    <div
                        style="
                            margin-top:22px;
                            padding:17px;
                            border-radius:14px;
                            background:#f8fafc;
                            border:1px solid #e5e7eb;
                        "
                    >

                        <div
                            style="
                                font-size:13px;
                                font-weight:800;
                                color:#111827;
                                margin-bottom:12px;
                            "
                        >
                            🔐 Digital Traceability Records
                        </div>


                        <div
                            style="
                                display:grid;
                                grid-template-columns:
                                    repeat(2, minmax(0, 1fr));
                                gap:10px;
                            "
                        >

                            <div>

                                <div
                                    style="
                                        font-size:10px;
                                        color:#6b7280;
                                        font-weight:700;
                                    "
                                >
                                    HANDOVER ID
                                </div>

                                <div
                                    style="
                                        margin-top:3px;
                                        font-size:12px;
                                        font-weight:800;
                                        color:#111827;
                                        word-break:break-all;
                                    "
                                >
                                    ${handoverId}
                                </div>

                            </div>


                            <div>

                                <div
                                    style="
                                        font-size:10px;
                                        color:#6b7280;
                                        font-weight:700;
                                    "
                                >
                                    QR TOKEN
                                </div>

                                <div
                                    style="
                                        margin-top:3px;
                                        font-size:12px;
                                        font-weight:800;
                                        color:#111827;
                                        word-break:break-all;
                                    "
                                >
                                    ${token}
                                </div>

                            </div>

                        </div>


                        <div
                            style="
                                margin-top:12px;
                                padding-top:10px;
                                border-top:1px solid #e5e7eb;
                                font-size:11px;
                                color:#6b7280;
                            "
                        >
                            Recorded: ${date}
                        </div>

                    </div>


                    <!-- CLOSE -->

                    <button
                        id="closeTransactionDetailsBottom"
                        style="
                            width:100%;
                            margin-top:20px;
                            padding:12px;
                            border:none;
                            border-radius:11px;
                            background:#159570;
                            color:#ffffff;
                            font-size:14px;
                            font-weight:800;
                            cursor:pointer;
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        function closeModal() {

            const element =
                document.getElementById(
                    "transactionDetailsModal"
                );

            if (element) {
                element.remove();
            }

        }


        document
            .getElementById(
                "closeTransactionDetails"
            )
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "closeTransactionDetailsBottom"
            )
            .addEventListener(
                "click",
                closeModal
            );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeModal();

                }

            }
        );

    }


    function attachTransactionClickHandlers() {

        const card =
            document.getElementById(
                "recentTransactionsCard"
            );

        if (!card) {
            return;
        }


        const rows =
            card.querySelectorAll(
                "div"
            );


        rows.forEach(
            function (row) {

                if (
                    row.dataset &&
                    row.dataset.transactionDetailsAttached
                ) {
                    return;
                }


                const text =
                    row.innerText || "";


                if (
                    text.includes("KS-TXN-")
                ) {

                    const transactions =
                        getTransactions();


                    const matchingTransaction =
                        transactions
                            .slice()
                            .reverse()
                            .find(
                                function (transaction) {

                                    const id =
                                        transaction.id ||
                                        transaction.transactionId ||
                                        "";

                                    return text.includes(
                                        id
                                    );

                                }
                            );


                    if (
                        matchingTransaction
                    ) {

                        row.style.cursor =
                            "pointer";


                        row.style.transition =
                            "background 0.2s ease";


                        row.addEventListener(
                            "mouseenter",
                            function () {

                                row.style.background =
                                    "#f8fafc";

                            }
                        );


                        row.addEventListener(
                            "mouseleave",
                            function () {

                                row.style.background =
                                    "";

                            }
                        );


                        row.addEventListener(
                            "click",
                            function (event) {

                                event.stopPropagation();

                                openTransactionDetails(
                                    matchingTransaction
                                );

                            }
                        );


                        row.dataset.transactionDetailsAttached =
                            "true";

                    }

                }

            }
        );

    }


    window.openKabadiSetuTransactionDetails =
        openTransactionDetails;


    // Initial setup

    setTimeout(
        function () {

            attachTransactionClickHandlers();

        },
        1400
    );


    // Refresh handlers after dashboard updates

    setInterval(
        function () {

            attachTransactionClickHandlers();

        },
        1500
    );


    console.log(
        "✅ Step 5D - Transaction details + traceability active."
    );

})();
// ============================================================
// STEP 5E - COLLECTOR INVENTORY
// ============================================================

(function () {

    console.log("🚀 Step 5E - Collector Inventory loaded.");

    const INVENTORY_KEY =
        "kabadiSetuCollectorInventory";


    // ------------------------------------------------------------
    // MATERIAL RATES
    // ------------------------------------------------------------

    const inventoryRates = {

        "Iron": 35,
        "Steel": 45,
        "Aluminium": 140,
        "Copper": 700,
        "Plastic": 25,
        "Glass": 15,
        "Books & Newspapers": 28,
        "Printed Circuit Board": 220,
        "Copper Cable": 380,
        "Lithium Battery": 105,
        "Mobile Phone": 3500,
        "Laptop": 280,
        "Display/LCD": 180,
        "Electric Motor": 300,
        "Mixed E-Waste": 120

    };


    // ------------------------------------------------------------
    // GET INVENTORY
    // ------------------------------------------------------------

    function getCollectorInventory() {

        try {

            const saved =
                localStorage.getItem(
                    INVENTORY_KEY
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {

                    return parsed;

                }

            }

        } catch (error) {

            console.warn(
                "Step 5E: Could not load inventory.",
                error
            );

        }

        return [];

    }


    // ------------------------------------------------------------
    // SAVE INVENTORY
    // ------------------------------------------------------------

    function saveCollectorInventory(inventory) {

        try {

            localStorage.setItem(
                INVENTORY_KEY,
                JSON.stringify(inventory)
            );

        } catch (error) {

            console.warn(
                "Step 5E: Could not save inventory.",
                error
            );

        }

    }


    // ------------------------------------------------------------
    // MATERIAL ICON
    // ------------------------------------------------------------

    function getInventoryIcon(material) {

        const value =
            String(material)
                .toLowerCase();


        if (value.includes("plastic")) {
            return "🧴";
        }

        if (value.includes("copper")) {
            return "🔶";
        }

        if (
            value.includes("aluminium") ||
            value.includes("aluminum")
        ) {
            return "🥫";
        }

        if (value.includes("iron")) {
            return "🔩";
        }

        if (value.includes("steel")) {
            return "⚙️";
        }

        if (value.includes("glass")) {
            return "🫙";
        }

        if (
            value.includes("book") ||
            value.includes("paper") ||
            value.includes("newspaper")
        ) {
            return "📚";
        }

        if (
            value.includes("battery") ||
            value.includes("lithium")
        ) {
            return "🔋";
        }

        if (
            value.includes("pcb") ||
            value.includes("circuit")
        ) {
            return "💻";
        }

        if (
            value.includes("mobile") ||
            value.includes("phone")
        ) {
            return "📱";
        }

        if (value.includes("laptop")) {
            return "💻";
        }

        if (
            value.includes("display") ||
            value.includes("lcd")
        ) {
            return "🖥️";
        }

        if (value.includes("motor")) {
            return "⚙️";
        }

        if (
            value.includes("e-waste") ||
            value.includes("ewaste")
        ) {
            return "♻️";
        }

        return "♻️";

    }


    // ------------------------------------------------------------
    // FORMAT MONEY
    // ------------------------------------------------------------

    function formatInventoryMoney(value) {

        return (
            "₹" +
            Math.round(
                Number(value) || 0
            ).toLocaleString("en-IN")
        );

    }


    // ------------------------------------------------------------
    // OPEN ADD INVENTORY MODAL
    // ------------------------------------------------------------

    function openAddInventoryModal() {

        const oldModal =
            document.getElementById(
                "collectorInventoryModal"
            );

        if (oldModal) {
            oldModal.remove();
        }


        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "collectorInventoryModal";


        modal.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        `;


        modal.innerHTML = `

            <div
                style="
                    width:min(500px,100%);
                    background:#ffffff;
                    border-radius:22px;
                    box-shadow:0 20px 60px rgba(0,0,0,0.25);
                    overflow:hidden;
                "
            >

                <!-- HEADER -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        padding:20px 22px;
                        border-bottom:1px solid #e5e7eb;
                    "
                >

                    <div>

                        <div
                            style="
                                font-size:19px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            📦 Add to Inventory
                        </div>

                        <div
                            style="
                                margin-top:4px;
                                font-size:12px;
                                color:#6b7280;
                            "
                        >
                            Record collected material
                        </div>

                    </div>


                    <button
                        id="closeInventoryModal"
                        style="
                            width:36px;
                            height:36px;
                            border:none;
                            border-radius:10px;
                            background:#f3f4f6;
                            font-size:20px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>


                <!-- FORM -->

                <div
                    style="
                        padding:22px;
                    "
                >

                    <label
                        style="
                            display:block;
                            font-size:12px;
                            font-weight:800;
                            color:#374151;
                            margin-bottom:7px;
                        "
                    >
                        MATERIAL
                    </label>


                    <select
                        id="inventoryMaterialInput"
                        style="
                            width:100%;
                            padding:12px;
                            border:1px solid #d1d5db;
                            border-radius:11px;
                            font-size:14px;
                            outline:none;
                            background:#ffffff;
                        "
                    >

                        <option value="">
                            Select material
                        </option>

                        ${Object.keys(inventoryRates)
                            .map(
                                function (material) {

                                    return `
                                        <option value="${material}">
                                            ${material}
                                        </option>
                                    `;

                                }
                            )
                            .join("")}

                    </select>


                    <label
                        style="
                            display:block;
                            font-size:12px;
                            font-weight:800;
                            color:#374151;
                            margin-top:18px;
                            margin-bottom:7px;
                        "
                    >
                        PHYSICAL WEIGHT (KG)
                    </label>


                    <input
                        id="inventoryWeightInput"
                        type="number"
                        min="0.1"
                        step="0.1"
                        placeholder="Enter weight in kg"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:12px;
                            border:1px solid #d1d5db;
                            border-radius:11px;
                            font-size:14px;
                            outline:none;
                        "
                    />


                    <div
                        id="inventoryRatePreview"
                        style="
                            margin-top:14px;
                            padding:12px;
                            border-radius:11px;
                            background:#f0fdf4;
                            color:#15803d;
                            font-size:12px;
                            font-weight:700;
                        "
                    >
                        Select a material to see its indicative rate.
                    </div>


                    <div
                        style="
                            display:flex;
                            gap:10px;
                            margin-top:20px;
                        "
                    >

                        <button
                            id="cancelInventoryButton"
                            style="
                                flex:1;
                                padding:12px;
                                border:1px solid #d1d5db;
                                border-radius:11px;
                                background:#ffffff;
                                color:#374151;
                                font-size:14px;
                                font-weight:700;
                                cursor:pointer;
                            "
                        >
                            Cancel
                        </button>


                        <button
                            id="saveInventoryButton"
                            style="
                                flex:1;
                                padding:12px;
                                border:none;
                                border-radius:11px;
                                background:#159570;
                                color:#ffffff;
                                font-size:14px;
                                font-weight:800;
                                cursor:pointer;
                            "
                        >
                            Add Material
                        </button>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        const materialInput =
            document.getElementById(
                "inventoryMaterialInput"
            );

        const weightInput =
            document.getElementById(
                "inventoryWeightInput"
            );

        const ratePreview =
            document.getElementById(
                "inventoryRatePreview"
            );


        materialInput.addEventListener(
            "change",
            function () {

                const material =
                    materialInput.value;

                if (!material) {

                    ratePreview.innerText =
                        "Select a material to see its indicative rate.";

                    return;

                }


                const rate =
                    inventoryRates[material] || 0;


                ratePreview.innerText =
                    "Indicative recycler rate: ₹" +
                    rate +
                    "/kg";

            }
        );


        function closeModal() {

            const element =
                document.getElementById(
                    "collectorInventoryModal"
                );

            if (element) {
                element.remove();
            }

        }


        document
            .getElementById(
                "closeInventoryModal"
            )
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "cancelInventoryButton"
            )
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "saveInventoryButton"
            )
            .addEventListener(
                "click",
                function () {

                    const material =
                        materialInput.value;

                    const weight =
                        Number(
                            weightInput.value
                        );


                    if (!material) {

                        alert(
                            "Please select a material."
                        );

                        return;

                    }


                    if (
                        !Number.isFinite(weight) ||
                        weight <= 0
                    ) {

                        alert(
                            "Please enter a valid weight."
                        );

                        return;

                    }


                    const inventory =
                        getCollectorInventory();


                    const existing =
                        inventory.find(
                            function (item) {

                                return (
                                    item.material ===
                                    material
                                );

                            }
                        );


                    if (existing) {

                        existing.weight =
                            Number(existing.weight || 0) +
                            weight;

                        existing.updatedAt =
                            new Date().toISOString();

                    } else {

                        inventory.push({

                            id:
                                "INV-" +
                                Date.now()
                                    .toString(36)
                                    .toUpperCase(),

                            material:
                                material,

                            weight:
                                weight,

                            rate:
                                inventoryRates[material] || 0,

                            createdAt:
                                new Date().toISOString(),

                            updatedAt:
                                new Date().toISOString()

                        });

                    }


                    saveCollectorInventory(
                        inventory
                    );


                    closeModal();


                    renderCollectorInventory();


                    console.log(
                        "✅ Inventory updated:",
                        material,
                        weight + " kg"
                    );

                }
            );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeModal();

                }

            }
        );

    }


    // ------------------------------------------------------------
    // DELETE INVENTORY ITEM
    // ------------------------------------------------------------

    function removeInventoryItem(id) {

        const inventory =
            getCollectorInventory();


        const item =
            inventory.find(
                function (entry) {

                    return entry.id === id;

                }
            );


        if (!item) {
            return;
        }


        const confirmed =
            confirm(
                "Remove " +
                item.material +
                " from collector inventory?"
            );


        if (!confirmed) {
            return;
        }


        const updated =
            inventory.filter(
                function (entry) {

                    return entry.id !== id;

                }
            );


        saveCollectorInventory(
            updated
        );


        renderCollectorInventory();

    }


    // ------------------------------------------------------------
    // RENDER COLLECTOR INVENTORY
    // ------------------------------------------------------------

    function renderCollectorInventory() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (!dashboard) {
            return;
        }


        let card =
            document.getElementById(
                "collectorInventoryCard"
            );


        if (!card) {

            card =
                document.createElement(
                    "div"
                );

            card.id =
                "collectorInventoryCard";

            dashboard.appendChild(
                card
            );

        }


        const inventory =
            getCollectorInventory();


        let totalWeight = 0;
        let totalValue = 0;


        inventory.forEach(
            function (item) {

                const weight =
                    Number(item.weight) || 0;

                const rate =
                    Number(
                        item.rate ||
                        inventoryRates[item.material] ||
                        0
                    );

                totalWeight +=
                    weight;

                totalValue +=
                    weight * rate;

            }
        );


        const itemsHTML =
            inventory.length === 0

                ? `

                    <div
                        style="
                            padding:28px 15px;
                            text-align:center;
                            color:#6b7280;
                            font-size:13px;
                        "
                    >

                        <div
                            style="
                                font-size:35px;
                                margin-bottom:10px;
                            "
                        >
                            📦
                        </div>

                        <strong
                            style="
                                display:block;
                                color:#374151;
                                font-size:14px;
                                margin-bottom:5px;
                            "
                        >
                            Inventory is empty
                        </strong>

                        Add collected material to start
                        tracking your stock.

                    </div>

                `

                : inventory
                    .map(
                        function (item) {

                            const weight =
                                Number(
                                    item.weight
                                ) || 0;

                            const rate =
                                Number(
                                    item.rate ||
                                    inventoryRates[
                                        item.material
                                    ] ||
                                    0
                                );

                            const value =
                                weight * rate;


                            return `

                                <div
                                    style="
                                        display:flex;
                                        align-items:center;
                                        justify-content:space-between;
                                        gap:14px;
                                        padding:15px 0;
                                        border-bottom:1px solid #f1f5f9;
                                    "
                                >

                                    <div
                                        style="
                                            display:flex;
                                            align-items:center;
                                            gap:11px;
                                            min-width:0;
                                            flex:1;
                                        "
                                    >

                                        <div
                                            style="
                                                width:43px;
                                                height:43px;
                                                border-radius:12px;
                                                background:#f0fdf4;
                                                display:flex;
                                                align-items:center;
                                                justify-content:center;
                                                font-size:21px;
                                                flex-shrink:0;
                                            "
                                        >
                                            ${getInventoryIcon(
                                                item.material
                                            )}
                                        </div>


                                        <div
                                            style="
                                                min-width:0;
                                            "
                                        >

                                            <div
                                                style="
                                                    font-size:14px;
                                                    font-weight:800;
                                                    color:#111827;
                                                "
                                            >
                                                ${item.material}
                                            </div>


                                            <div
                                                style="
                                                    margin-top:4px;
                                                    font-size:12px;
                                                    color:#6b7280;
                                                "
                                            >
                                                ${weight} kg
                                                • ₹${rate}/kg
                                            </div>

                                        </div>

                                    </div>


                                    <div
                                        style="
                                            text-align:right;
                                            flex-shrink:0;
                                        "
                                    >

                                        <div
                                            style="
                                                font-size:15px;
                                                font-weight:800;
                                                color:#159570;
                                            "
                                        >
                                            ${formatInventoryMoney(
                                                value
                                            )}
                                        </div>


                                        <button
                                            data-remove-inventory="${item.id}"
                                            style="
                                                margin-top:5px;
                                                padding:4px 8px;
                                                border:none;
                                                border-radius:7px;
                                                background:#fef2f2;
                                                color:#dc2626;
                                                font-size:10px;
                                                font-weight:700;
                                                cursor:pointer;
                                            "
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("");


        card.innerHTML = `

            <div
                style="
                    background:#ffffff;
                    border:1px solid #e5e7eb;
                    border-radius:18px;
                    padding:22px;
                    margin-top:22px;
                    box-shadow:0 4px 14px rgba(0,0,0,0.05);
                "
            >

                <!-- HEADER -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:15px;
                        margin-bottom:17px;
                    "
                >

                    <div>

                        <div
                            style="
                                font-size:19px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            📦 Collector Inventory
                        </div>


                        <div
                            style="
                                margin-top:5px;
                                font-size:13px;
                                color:#6b7280;
                            "
                        >
                            Track collected material before selling to recyclers
                        </div>

                    </div>


                    <button
                        id="addInventoryButton"
                        style="
                            padding:9px 13px;
                            border:none;
                            border-radius:10px;
                            background:#159570;
                            color:#ffffff;
                            font-size:12px;
                            font-weight:800;
                            cursor:pointer;
                            white-space:nowrap;
                        "
                    >
                        + Add Material
                    </button>

                </div>


                <!-- SUMMARY -->

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(2, minmax(0,1fr));
                        gap:10px;
                        margin-bottom:8px;
                    "
                >

                    <div
                        style="
                            padding:13px;
                            border-radius:12px;
                            background:#f8fafc;
                        "
                    >

                        <div
                            style="
                                font-size:10px;
                                color:#6b7280;
                                font-weight:700;
                            "
                        >
                            TOTAL STOCK
                        </div>

                        <div
                            style="
                                margin-top:4px;
                                font-size:17px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            ${totalWeight.toFixed(
                                totalWeight % 1 === 0
                                    ? 0
                                    : 2
                            )} kg
                        </div>

                    </div>


                    <div
                        style="
                            padding:13px;
                            border-radius:12px;
                            background:#f0fdf4;
                        "
                    >

                        <div
                            style="
                                font-size:10px;
                                color:#6b7280;
                                font-weight:700;
                            "
                        >
                            EST. STOCK VALUE
                        </div>

                        <div
                            style="
                                margin-top:4px;
                                font-size:17px;
                                font-weight:800;
                                color:#159570;
                            "
                        >
                            ${formatInventoryMoney(
                                totalValue
                            )}
                        </div>

                    </div>

                </div>


                <!-- ITEMS -->

                <div>
                    ${itemsHTML}
                </div>


                <div
                    style="
                        margin-top:14px;
                        padding-top:13px;
                        border-top:1px solid #f1f5f9;
                        font-size:11px;
                        color:#6b7280;
                    "
                >
                    Values are indicative and based on the current stored material rates.
                </div>

            </div>

        `;


        // Add button

        const addButton =
            document.getElementById(
                "addInventoryButton"
            );


        if (addButton) {

            addButton.addEventListener(
                "click",
                openAddInventoryModal
            );

        }


        // Remove buttons

        card
            .querySelectorAll(
                "[data-remove-inventory]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            removeInventoryItem(
                                button.dataset.removeInventory
                            );

                        }
                    );

                }
            );

    }


    // ------------------------------------------------------------
    // EXPOSE FUNCTIONS
    // ------------------------------------------------------------

    window.getCollectorInventory =
        getCollectorInventory;


    window.saveCollectorInventory =
        saveCollectorInventory;


    window.renderCollectorInventory =
        renderCollectorInventory;


    window.openAddInventoryModal =
        openAddInventoryModal;


    // ------------------------------------------------------------
    // INITIAL RENDER
    // ------------------------------------------------------------

    setTimeout(
        function () {

            renderCollectorInventory();

        },
        1200
    );


    // ------------------------------------------------------------
    // REFRESH WHEN DASHBOARD OPENS
    // ------------------------------------------------------------

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".nav-item"
                );


            if (!button) {
                return;
            }


            if (
                button.innerText
                    .toLowerCase()
                    .includes("dashboard")
            ) {

                setTimeout(
                    function () {

                        renderCollectorInventory();

                    },
                    350
                );

            }

        }
    );


    // ------------------------------------------------------------
    // KEEP UI SYNCHRONIZED
    // ------------------------------------------------------------

    setInterval(
        function () {

            renderCollectorInventory();

        },
        2000
    );


    console.log(
        "✅ Step 5E - Collector Inventory active."
    );

})();
// ============================================================
// STEP 5F - BEST RECYCLER RECOMMENDATION
// ============================================================

(function () {

    console.log("🚀 Step 5F - Best Recycler Recommendation loaded.");

    const INVENTORY_KEY =
        "kabadiSetuCollectorInventory";


    // ------------------------------------------------------------
    // GET INVENTORY
    // ------------------------------------------------------------

    function getInventory() {

        try {

            const saved =
                localStorage.getItem(
                    INVENTORY_KEY
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

            }

        } catch (error) {

            console.warn(
                "Step 5F: Could not read inventory.",
                error
            );

        }

        return [];

    }


    // ------------------------------------------------------------
    // FORMAT MONEY
    // ------------------------------------------------------------

    function formatMoney(value) {

        return (
            "₹" +
            Math.round(
                Number(value) || 0
            ).toLocaleString("en-IN")
        );

    }


    // ------------------------------------------------------------
    // OPEN RECYCLER COMPARISON
    // ------------------------------------------------------------

    function openBestRecyclerModal(item) {

        if (!item) {
            return;
        }


        const material =
            item.material;

        const weight =
            Number(item.weight) || 0;


        if (!material || weight <= 0) {

            alert(
                "Valid inventory material and weight are required."
            );

            return;

        }


        const oldModal =
            document.getElementById(
                "bestRecyclerModal"
            );

        if (oldModal) {
            oldModal.remove();
        }


        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "bestRecyclerModal";


        modal.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        `;


        modal.innerHTML = `

            <div
                style="
                    width:min(760px,100%);
                    max-height:90vh;
                    overflow-y:auto;
                    background:#ffffff;
                    border-radius:22px;
                    box-shadow:0 20px 60px rgba(0,0,0,0.25);
                "
            >

                <!-- HEADER -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:15px;
                        padding:21px 23px;
                        border-bottom:1px solid #e5e7eb;
                    "
                >

                    <div>

                        <div
                            style="
                                font-size:20px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            🏆 Find Best Recycler
                        </div>

                        <div
                            style="
                                margin-top:5px;
                                font-size:12px;
                                color:#6b7280;
                            "
                        >
                            Compare verified recyclers for your inventory
                        </div>

                    </div>


                    <button
                        id="closeBestRecyclerModal"
                        style="
                            width:36px;
                            height:36px;
                            border:none;
                            border-radius:10px;
                            background:#f3f4f6;
                            color:#374151;
                            font-size:20px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>


                <!-- MATERIAL SUMMARY -->

                <div
                    style="
                        margin:20px 23px;
                        padding:17px;
                        border-radius:15px;
                        background:#f0fdf4;
                        border:1px solid #bbf7d0;
                    "
                >

                    <div
                        style="
                            font-size:12px;
                            color:#166534;
                            font-weight:700;
                        "
                    >
                        SELLING FROM INVENTORY
                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:15px;
                            margin-top:7px;
                        "
                    >

                        <div
                            style="
                                font-size:18px;
                                font-weight:800;
                                color:#111827;
                            "
                        >
                            ${material}
                        </div>


                        <div
                            style="
                                font-size:18px;
                                font-weight:800;
                                color:#159570;
                            "
                        >
                            ${weight} kg
                        </div>

                    </div>

                </div>


                <!-- LOADING -->

                <div
                    id="bestRecyclerResults"
                    style="
                        padding:0 23px 23px;
                    "
                >

                    <div
                        style="
                            padding:30px;
                            text-align:center;
                            color:#6b7280;
                            font-size:13px;
                        "
                    >
                        🔄 Comparing recycler prices...
                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        function closeModal() {

            const element =
                document.getElementById(
                    "bestRecyclerModal"
                );

            if (element) {
                element.remove();
            }

        }


        document
            .getElementById(
                "closeBestRecyclerModal"
            )
            .addEventListener(
                "click",
                closeModal
            );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeModal();

                }

            }
        );


        compareRecyclerPrices(
            material,
            weight
        );

    }


    // ------------------------------------------------------------
    // COMPARE RECYCLER PRICES
    // ------------------------------------------------------------

    async function compareRecyclerPrices(
        material,
        weight
    ) {

        const results =
            document.getElementById(
                "bestRecyclerResults"
            );


        if (!results) {
            return;
        }


        try {

            const response =
                await fetch(
                    "/recyclers",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                material:
                                    material,

                                weight:
                                    weight
                            })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.recyclers ||
                !Array.isArray(
                    data.recyclers
                )
            ) {

                throw new Error(
                    "Recycler comparison failed."
                );

            }


            const recyclers =
                data.recyclers
                    .slice()
                    .sort(
                        function (a, b) {

                            return (
                                Number(
                                    b.rate
                                ) -
                                Number(
                                    a.rate
                                )
                            );

                        }
                    );


            if (
                recyclers.length === 0
            ) {

                results.innerHTML = `

                    <div
                        style="
                            padding:30px 10px;
                            text-align:center;
                            color:#6b7280;
                        "
                    >
                        No verified recycler found for
                        <strong>${material}</strong>.
                    </div>

                `;

                return;

            }


            const best =
                recyclers[0];


            const bestRate =
                Number(
                    best.rate
                ) || 0;


            const bestValue =
                Number(
                    best.estimated_value
                ) ||
                (
                    bestRate *
                    weight
                );


            // ----------------------------------------------------
            // BEST RECYCLER BANNER
            // ----------------------------------------------------

            let html = `

                <div
                    style="
                        padding:17px;
                        margin-bottom:17px;
                        border-radius:15px;
                        background:#ecfdf5;
                        border:1px solid #86efac;
                    "
                >

                    <div
                        style="
                            font-size:11px;
                            color:#15803d;
                            font-weight:800;
                            letter-spacing:0.4px;
                        "
                    >
                        🏆 RECOMMENDED RECYCLER
                    </div>


                    <div
                        style="
                            margin-top:6px;
                            font-size:19px;
                            font-weight:800;
                            color:#111827;
                        "
                    >
                        ${best.name}
                    </div>


                    <div
                        style="
                            margin-top:5px;
                            font-size:13px;
                            color:#4b5563;
                        "
                    >
                        Best available price for
                        ${weight} kg of ${material}
                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:flex-end;
                            gap:15px;
                            margin-top:14px;
                        "
                    >

                        <div>

                            <div
                                style="
                                    font-size:11px;
                                    color:#6b7280;
                                "
                            >
                                RATE
                            </div>

                            <strong
                                style="
                                    display:block;
                                    margin-top:3px;
                                    font-size:22px;
                                    color:#159570;
                                "
                            >
                                ${formatMoney(
                                    bestRate
                                )}/kg
                            </strong>

                        </div>


                        <div
                            style="
                                text-align:right;
                            "
                        >

                            <div
                                style="
                                    font-size:11px;
                                    color:#6b7280;
                                "
                            >
                                ESTIMATED EARNING
                            </div>

                            <strong
                                style="
                                    display:block;
                                    margin-top:3px;
                                    font-size:22px;
                                    color:#159570;
                                "
                            >
                                ${formatMoney(
                                    bestValue
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <div
                    style="
                        font-size:15px;
                        font-weight:800;
                        color:#111827;
                        margin-bottom:10px;
                    "
                >
                    Compare Verified Recyclers
                </div>

            `;


            // ----------------------------------------------------
            // RECYCLER CARDS
            // ----------------------------------------------------

            recyclers.forEach(
                function (
                    recycler,
                    index
                ) {

                    const rate =
                        Number(
                            recycler.rate
                        ) || 0;


                    const estimatedValue =
                        Number(
                            recycler.estimated_value
                        ) ||
                        (
                            rate *
                            weight
                        );


                    const isBest =
                        index === 0;


                    const difference =
                        bestRate -
                        rate;


                    html += `

                        <div
                            style="
                                position:relative;
                                padding:17px;
                                margin-bottom:11px;
                                border-radius:15px;
                                border:${isBest
                                    ? "2px solid #22c55e"
                                    : "1px solid #e5e7eb"};
                                background:${isBest
                                    ? "#f0fdf4"
                                    : "#ffffff"};
                            "
                        >

                            ${
                                isBest
                                    ? `
                                        <div
                                            style="
                                                position:absolute;
                                                top:12px;
                                                right:12px;
                                                padding:5px 9px;
                                                border-radius:999px;
                                                background:#dcfce7;
                                                color:#166534;
                                                font-size:10px;
                                                font-weight:800;
                                            "
                                        >
                                            🏆 BEST PRICE
                                        </div>
                                    `
                                    : ""
                            }


                            <div
                                style="
                                    padding-right:${isBest
                                        ? "105px"
                                        : "0"};
                                "
                            >

                                <div
                                    style="
                                        font-size:15px;
                                        font-weight:800;
                                        color:#111827;
                                    "
                                >
                                    ${recycler.name}
                                </div>


                                <div
                                    style="
                                        margin-top:6px;
                                        display:flex;
                                        flex-wrap:wrap;
                                        gap:8px;
                                    "
                                >

                                    <span
                                        style="
                                            padding:4px 7px;
                                            border-radius:999px;
                                            background:#dcfce7;
                                            color:#166534;
                                            font-size:10px;
                                            font-weight:700;
                                        "
                                    >
                                        ✓ ${recycler.authorization || "Verified"}
                                    </span>


                                    ${
                                        recycler.distance
                                            ? `
                                                <span
                                                    style="
                                                        padding:4px 7px;
                                                        border-radius:999px;
                                                        background:#f3f4f6;
                                                        color:#4b5563;
                                                        font-size:10px;
                                                        font-weight:700;
                                                    "
                                                >
                                                    📍 ${recycler.distance}
                                                </span>
                                            `
                                            : ""
                                    }


                                    ${
                                        recycler.rating
                                            ? `
                                                <span
                                                    style="
                                                        padding:4px 7px;
                                                        border-radius:999px;
                                                        background:#fef3c7;
                                                        color:#92400e;
                                                        font-size:10px;
                                                        font-weight:700;
                                                    "
                                                >
                                                    ⭐ ${recycler.rating}
                                                </span>
                                            `
                                            : ""
                                    }

                                </div>


                                <div
                                    style="
                                        display:flex;
                                        justify-content:space-between;
                                        align-items:flex-end;
                                        gap:15px;
                                        margin-top:13px;
                                    "
                                >

                                    <div>

                                        <div
                                            style="
                                                font-size:10px;
                                                color:#6b7280;
                                                font-weight:700;
                                            "
                                        >
                                            PRICE
                                        </div>

                                        <strong
                                            style="
                                                display:block;
                                                margin-top:3px;
                                                font-size:20px;
                                                color:#159570;
                                            "
                                        >
                                            ${formatMoney(
                                                rate
                                            )}/kg
                                        </strong>

                                    </div>


                                    <div
                                        style="
                                            text-align:right;
                                        "
                                    >

                                        <div
                                            style="
                                                font-size:10px;
                                                color:#6b7280;
                                                font-weight:700;
                                            "
                                        >
                                            ${weight} KG VALUE
                                        </div>

                                        <strong
                                            style="
                                                display:block;
                                                margin-top:3px;
                                                font-size:18px;
                                                color:#111827;
                                            "
                                        >
                                            ${formatMoney(
                                                estimatedValue
                                            )}
                                        </strong>

                                    </div>

                                </div>


                                ${
                                    difference > 0
                                        ? `
                                            <div
                                                style="
                                                    margin-top:9px;
                                                    font-size:11px;
                                                    color:#dc2626;
                                                "
                                            >
                                                ${formatMoney(
                                                    difference
                                                )}/kg lower than the best price
                                            </div>
                                        `
                                        : `
                                            <div
                                                style="
                                                    margin-top:9px;
                                                    font-size:11px;
                                                    color:#15803d;
                                                    font-weight:700;
                                                "
                                            >
                                                ✓ Highest available rate
                                            </div>
                                        `
                                }


                                <button
                                    data-select-best-recycler="${index}"
                                    style="
                                        width:100%;
                                        margin-top:13px;
                                        padding:10px;
                                        border:none;
                                        border-radius:10px;
                                        background:${isBest
                                            ? "#159570"
                                            : "#f0fdf4"};
                                        color:${isBest
                                            ? "#ffffff"
                                            : "#15803d"};
                                        font-size:12px;
                                        font-weight:800;
                                        cursor:pointer;
                                    "
                                >
                                    ${
                                        isBest
                                            ? "Select Recommended Recycler"
                                            : "Select This Recycler"
                                    }
                                </button>

                            </div>

                        </div>

                    `;

                }
            );


            results.innerHTML =
                html;


            // ----------------------------------------------------
            // SELECT RECYCLER
            // ----------------------------------------------------

            results
                .querySelectorAll(
                    "[data-select-best-recycler]"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                const index =
                                    Number(
                                        button.dataset
                                            .selectBestRecycler
                                    );


                                const selected =
                                    recyclers[index];


                                if (!selected) {
                                    return;
                                }


                                selectCollectorRecycler(
                                    selected,
                                    material,
                                    weight
                                );

                            }
                        );

                    }
                );


        } catch (error) {

            console.error(
                "Step 5F recycler comparison error:",
                error
            );


            results.innerHTML = `

                <div
                    style="
                        padding:25px;
                        text-align:center;
                        border-radius:14px;
                        background:#fef2f2;
                        border:1px solid #fecaca;
                        color:#b91c1c;
                        font-size:13px;
                    "
                >

                    ❌ Unable to compare recycler prices.

                    <div
                        style="
                            margin-top:6px;
                            font-size:11px;
                            color:#7f1d1d;
                        "
                    >
                        Please make sure the Kabadi Setu server is running.
                    </div>

                </div>

            `;

        }

    }


    // ------------------------------------------------------------
    // SELECT COLLECTOR RECYCLER
    // ------------------------------------------------------------

    function selectCollectorRecycler(
        recycler,
        material,
        weight
    ) {

        const value =
            Number(
                recycler.estimated_value
            ) ||
            (
                Number(recycler.rate || 0) *
                Number(weight || 0)
            );


        // Save collector selection

        window.collectorSelectedRecycler = {

            recycler:
                recycler,

            material:
                material,

            weight:
                weight,

            estimatedValue:
                value,

            selectedAt:
                new Date().toISOString()

        };


        console.log(
            "✅ Step 5F: Collector recycler selected",
            window.collectorSelectedRecycler
        );


        // Close comparison modal

        const modal =
            document.getElementById(
                "bestRecyclerModal"
            );

        if (modal) {
            modal.remove();
        }


        // Show confirmation

        showCollectorRecyclerConfirmation(
            recycler,
            material,
            weight,
            value
        );

    }


    // ------------------------------------------------------------
    // CONFIRMATION
    // ------------------------------------------------------------

    function showCollectorRecyclerConfirmation(
        recycler,
        material,
        weight,
        value
    ) {

        const oldModal =
            document.getElementById(
                "collectorRecyclerConfirmation"
            );

        if (oldModal) {
            oldModal.remove();
        }


        const modal =
            document.createElement(
                "div"
            );

        modal.id =
            "collectorRecyclerConfirmation";


        modal.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        `;


        modal.innerHTML = `

            <div
                style="
                    width:min(500px,100%);
                    background:#ffffff;
                    border-radius:22px;
                    padding:25px;
                    box-shadow:0 20px 60px rgba(0,0,0,0.25);
                "
            >

                <div
                    style="
                        text-align:center;
                    "
                >

                    <div
                        style="
                            width:58px;
                            height:58px;
                            margin:0 auto;
                            border-radius:50%;
                            background:#dcfce7;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:28px;
                        "
                    >
                        🏆
                    </div>


                    <div
                        style="
                            margin-top:13px;
                            font-size:20px;
                            font-weight:800;
                            color:#111827;
                        "
                    >
                        Recycler Selected
                    </div>


                    <div
                        style="
                            margin-top:5px;
                            font-size:13px;
                            color:#6b7280;
                        "
                    >
                        You selected the best available price.
                    </div>

                </div>


                <div
                    style="
                        margin-top:20px;
                        padding:17px;
                        border-radius:15px;
                        background:#f8fafc;
                        border:1px solid #e5e7eb;
                    "
                >

                    <div
                        style="
                            font-size:16px;
                            font-weight:800;
                            color:#111827;
                        "
                    >
                        ${recycler.name}
                    </div>


                    <div
                        style="
                            margin-top:9px;
                            font-size:13px;
                            color:#6b7280;
                        "
                    >
                        ${material} • ${weight} kg
                    </div>


                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            margin-top:15px;
                        "
                    >

                        <div>

                            <div
                                style="
                                    font-size:10px;
                                    color:#6b7280;
                                    font-weight:700;
                                "
                            >
                                RATE
                            </div>

                            <strong
                                style="
                                    display:block;
                                    margin-top:3px;
                                    color:#159570;
                                    font-size:19px;
                                "
                            >
                                ${formatMoney(
                                    recycler.rate
                                )}/kg
                            </strong>

                        </div>


                        <div
                            style="
                                text-align:right;
                            "
                        >

                            <div
                                style="
                                    font-size:10px;
                                    color:#6b7280;
                                    font-weight:700;
                                "
                            >
                                ESTIMATED VALUE
                            </div>

                            <strong
                                style="
                                    display:block;
                                    margin-top:3px;
                                    color:#159570;
                                    font-size:19px;
                                "
                            >
                                ${formatMoney(
                                    value
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <div
                    style="
                        margin-top:14px;
                        padding:12px;
                        border-radius:11px;
                        background:#fffbeb;
                        border:1px solid #fde68a;
                        font-size:11px;
                        color:#92400e;
                        line-height:1.5;
                    "
                >
                    💡 Final payment is subject to actual physical
                    weighing and the recycler's applicable rate
                    at the time of handover.
                </div>


                <div
                    style="
                        display:flex;
                        gap:10px;
                        margin-top:18px;
                    "
                >

                    <button
                        id="closeCollectorRecyclerConfirmation"
                        style="
                            flex:1;
                            padding:12px;
                            border:1px solid #d1d5db;
                            border-radius:11px;
                            background:#ffffff;
                            color:#374151;
                            font-size:13px;
                            font-weight:700;
                            cursor:pointer;
                        "
                    >
                        Close
                    </button>


                    <button
                        id="proceedCollectorHandover"
                        style="
                            flex:1;
                            padding:12px;
                            border:none;
                            border-radius:11px;
                            background:#159570;
                            color:#ffffff;
                            font-size:13px;
                            font-weight:800;
                            cursor:pointer;
                        "
                    >
                        Proceed to Handover
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        function closeModal() {

            const element =
                document.getElementById(
                    "collectorRecyclerConfirmation"
                );

            if (element) {
                element.remove();
            }

        }


        document
            .getElementById(
                "closeCollectorRecyclerConfirmation"
            )
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById(
                "proceedCollectorHandover"
            )
            .addEventListener(
                "click",
                function () {

                    closeModal();


                    // Connect with existing handover system
                    if (
                        typeof window.prepareRecyclerHandover ===
                        "function"
                    ) {

                        window.prepareRecyclerHandover();

                    } else {

                        alert(
                            "Recycler selected successfully. Handover module is ready."
                        );

                    }

                }
            );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeModal();

                }

            }
        );

    }


    // ------------------------------------------------------------
    // ADD "FIND BEST RECYCLER" BUTTON TO INVENTORY
    // ------------------------------------------------------------

    function attachInventoryRecyclerButtons() {

        const card =
            document.getElementById(
                "collectorInventoryCard"
            );


        if (!card) {
            return;
        }


        const rows =
            card.querySelectorAll(
                "div"
            );


        rows.forEach(
            function (row) {

                if (
                    row.dataset &&
                    row.dataset.bestRecyclerAttached
                ) {
                    return;
                }


                const text =
                    row.innerText || "";


                const inventory =
                    getInventory();


                const matchingItem =
                    inventory.find(
                        function (item) {

                            return (
                                text.includes(
                                    item.material
                                ) &&
                                text.includes(
                                    String(
                                        item.weight
                                    )
                                )
                            );

                        }
                    );


                if (
                    !matchingItem
                ) {
                    return;
                }


                // Prevent nested duplicate buttons

                if (
                    row.querySelector(
                        "[data-best-recycler-button]"
                    )
                ) {
                    return;
                }


                const actionArea =
                    document.createElement(
                        "div"
                    );


                actionArea.style.cssText = `
                    margin-top:10px;
                `;


                actionArea.innerHTML = `

                    <button
                        data-best-recycler-button="true"
                        style="
                            width:100%;
                            padding:9px 11px;
                            border:none;
                            border-radius:9px;
                            background:#eff6ff;
                            color:#2563eb;
                            font-size:11px;
                            font-weight:800;
                            cursor:pointer;
                        "
                    >
                        🏆 Find Best Recycler
                    </button>

                `;


                row.appendChild(
                    actionArea
                );


                const button =
                    actionArea.querySelector(
                        "[data-best-recycler-button]"
                    );


                button.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        openBestRecyclerModal(
                            matchingItem
                        );

                    }
                );


                row.dataset.bestRecyclerAttached =
                    "true";

            }
        );

    }


    // ------------------------------------------------------------
    // EXPOSE FUNCTIONS
    // ------------------------------------------------------------

    window.openBestRecyclerForInventory =
        openBestRecyclerModal;


    window.compareCollectorRecyclerPrices =
        compareRecyclerPrices;


    window.collectorSelectedRecycler =
        window.collectorSelectedRecycler ||
        null;


    // ------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------

    setTimeout(
        function () {

            attachInventoryRecyclerButtons();

        },
        1600
    );


    // ------------------------------------------------------------
    // REFRESH
    // ------------------------------------------------------------

    setInterval(
        function () {

            attachInventoryRecyclerButtons();

        },
        2000
    );


    console.log(
        "✅ Step 5F - Best Recycler Recommendation active."
    );

})();

// ============================================================
// STEP 5G - COLLECTOR SELL / HANDOVER FLOW
// Inventory → Recycler → Handover → Sold → Inventory Updated
// ============================================================

(function () {

    console.log("🚀 Step 5G - Collector Sell / Handover Flow loaded.");

    const SALES_KEY = "kabadiSetuCollectorSales";

    // ------------------------------------------------------------
    // STORAGE HELPERS
    // ------------------------------------------------------------

    function getCollectorSales() {
        try {
            const data = JSON.parse(localStorage.getItem(SALES_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Step 5G: Could not read collector sales.", error);
            return [];
        }
    }

    function saveCollectorSales(sales) {
        localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    }

    function generateCollectorSaleId() {
        const now = new Date();

        const date =
            now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getDate()).padStart(2, "0");

        const random = Math.floor(100000 + Math.random() * 900000);

        return "CS-" + date + "-" + random;
    }

    function generateCollectorToken() {
        return (
            "KSETU-COL-" +
            Date.now().toString(36).toUpperCase()
        );
    }

    function formatMoney(value) {
        return "₹" + Number(value || 0).toLocaleString("en-IN");
    }

    // ------------------------------------------------------------
    // NORMALIZE SELECTED RECYCLER
    // ------------------------------------------------------------

    function getSelectedRecyclerData() {

        const selected = window.collectorSelectedRecycler;

        if (!selected) {
            return null;
        }

        const recycler = selected.recycler || {};

        const material = selected.material || "";
        const weight = Number(selected.weight) || 0;

        const rate =
            Number(
                recycler.rate ??
                recycler.recyclerRate ??
                selected.rate ??
                0
            ) || 0;

        const estimatedValue =
            Number(
                recycler.estimated_value ??
                recycler.estimatedValue ??
                selected.estimatedValue ??
                0
            ) || (rate * weight);

        return {
            material: material,
            weight: weight,
            recycler: {
                ...recycler,
                name: recycler.name || "Unknown Recycler",
                rate: rate,
                estimated_value: estimatedValue,
                distance: recycler.distance || "Distance unavailable",
                rating: Number(recycler.rating) || 0,
                authorization: recycler.authorization || "Verified",
                pickup: Boolean(recycler.pickup)
            },
            rate: rate,
            estimatedValue: estimatedValue
        };
    }

    // ------------------------------------------------------------
    // COLLECTOR HANDOVER MODAL
    // ------------------------------------------------------------

    function createCollectorHandoverModal() {

        if (document.getElementById("collectorHandoverModal")) {
            return;
        }

        const modal = document.createElement("div");

        modal.id = "collectorHandoverModal";

        modal.innerHTML = `
            <div class="modal-overlay" style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,0.65);
                z-index:99999;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
            ">

                <div style="
                    width:min(650px, 100%);
                    max-height:90vh;
                    overflow-y:auto;
                    background:#ffffff;
                    border-radius:20px;
                    padding:25px;
                    box-shadow:0 20px 60px rgba(0,0,0,0.25);
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:20px;
                    ">

                        <div>
                            <h2 style="margin:0 0 5px 0;">
                                📦 Collector Handover
                            </h2>

                            <p style="
                                margin:0;
                                color:#666;
                                font-size:14px;
                            ">
                                Complete the sale to the selected recycler
                            </p>
                        </div>

                        <button
                            id="closeCollectorHandoverBtn"
                            style="
                                border:none;
                                background:#f1f1f1;
                                width:38px;
                                height:38px;
                                border-radius:50%;
                                font-size:20px;
                                cursor:pointer;
                            "
                        >
                            ×
                        </button>

                    </div>

                    <div id="collectorHandoverContent"></div>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        document
            .getElementById("closeCollectorHandoverBtn")
            .addEventListener("click", closeCollectorHandover);

        modal
            .querySelector(".modal-overlay")
            .addEventListener("click", function (event) {

                if (event.target === this) {
                    closeCollectorHandover();
                }

            });
    }

    // ------------------------------------------------------------
    // OPEN COLLECTOR HANDOVER
    // ------------------------------------------------------------

    function openCollectorHandover(data) {

        if (!data) {
            data = getSelectedRecyclerData();
        }

        if (!data) {
            alert(
                "Please select a recycler from Best Recycler Recommendation first."
            );
            return;
        }

        if (!data.material || data.weight <= 0) {
            alert("Material and weight are required for handover.");
            return;
        }

        createCollectorHandoverModal();

        const modal = document.getElementById(
            "collectorHandoverModal"
        );

        const content = document.getElementById(
            "collectorHandoverContent"
        );

        const recycler = data.recycler;

        const saleId = generateCollectorSaleId();
        const token = generateCollectorToken();

        window.activeCollectorHandover = {
            saleId: saleId,
            token: token,
            material: data.material,
            weight: data.weight,
            recycler: recycler,
            rate: data.rate,
            estimatedValue: data.estimatedValue,
            createdAt: new Date().toISOString()
        };

        content.innerHTML = `

            <div style="
                background:#f7f8fa;
                border-radius:15px;
                padding:18px;
                margin-bottom:15px;
            ">

                <div style="
                    font-size:13px;
                    color:#777;
                    margin-bottom:5px;
                ">
                    SELECTED RECYCLER
                </div>

                <div style="
                    font-size:21px;
                    font-weight:700;
                    margin-bottom:8px;
                ">
                    ♻️ ${recycler.name}
                </div>

                <div style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:10px;
                    font-size:13px;
                ">

                    <span>
                        📍 ${recycler.distance}
                    </span>

                    <span>
                        ⭐ ${recycler.rating || "N/A"}
                    </span>

                    <span>
                        ✅ ${recycler.authorization}
                    </span>

                </div>

            </div>


            <div style="
                display:grid;
                grid-template-columns:repeat(2, 1fr);
                gap:12px;
                margin-bottom:18px;
            ">

                <div style="
                    background:#f7f8fa;
                    border-radius:14px;
                    padding:15px;
                ">
                    <div style="
                        font-size:12px;
                        color:#777;
                    ">
                        MATERIAL
                    </div>

                    <strong style="font-size:18px;">
                        ${data.material}
                    </strong>
                </div>


                <div style="
                    background:#f7f8fa;
                    border-radius:14px;
                    padding:15px;
                ">
                    <div style="
                        font-size:12px;
                        color:#777;
                    ">
                        PHYSICAL WEIGHT
                    </div>

                    <strong style="font-size:18px;">
                        ${data.weight} kg
                    </strong>
                </div>


                <div style="
                    background:#f7f8fa;
                    border-radius:14px;
                    padding:15px;
                ">
                    <div style="
                        font-size:12px;
                        color:#777;
                    ">
                        RECYCLER RATE
                    </div>

                    <strong style="font-size:18px;">
                        ${formatMoney(data.rate)}/kg
                    </strong>
                </div>


                <div style="
                    background:#f7f8fa;
                    border-radius:14px;
                    padding:15px;
                ">
                    <div style="
                        font-size:12px;
                        color:#777;
                    ">
                        INDICATIVE VALUE
                    </div>

                    <strong style="
                        font-size:18px;
                    ">
                        ${formatMoney(data.estimatedValue)}
                    </strong>
                </div>

            </div>


            <div style="
                border:1px solid #e4e4e4;
                border-radius:14px;
                padding:15px;
                margin-bottom:18px;
            ">

                <div style="
                    font-size:13px;
                    color:#666;
                    margin-bottom:7px;
                ">
                    HANDOVER REFERENCE
                </div>

                <strong style="
                    font-size:20px;
                    letter-spacing:1px;
                ">
                    ${saleId}
                </strong>

                <div style="
                    margin-top:8px;
                    font-size:12px;
                    color:#777;
                    word-break:break-all;
                ">
                    QR Token: ${token}
                </div>

            </div>


            <div style="
                background:#fff8e6;
                border:1px solid #f1d48a;
                border-radius:14px;
                padding:15px;
                margin-bottom:20px;
                font-size:13px;
                line-height:1.6;
            ">

                ⚠️ <strong>Important:</strong><br>

                This amount is an indicative value based on the
                selected recycler rate and entered weight.

                Final settlement may change after the recycler
                physically verifies the material and weight.

            </div>


            <div style="
                display:flex;
                gap:10px;
                flex-wrap:wrap;
            ">

                <button
                    id="collectorGenerateQRBtn"
                    style="
                        flex:1;
                        min-width:200px;
                        padding:14px;
                        border:none;
                        border-radius:12px;
                        background:#111827;
                        color:white;
                        font-size:15px;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    🔐 Generate Handover Token
                </button>

                <button
                    id="collectorMarkSoldBtn"
                    style="
                        flex:1;
                        min-width:200px;
                        padding:14px;
                        border:none;
                        border-radius:12px;
                        background:#16a34a;
                        color:white;
                        font-size:15px;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    ✅ Mark as Sold
                </button>

            </div>

        `;

        modal.style.display = "block";

        document
            .getElementById("collectorGenerateQRBtn")
            .addEventListener("click", generateCollectorHandoverToken);

        document
            .getElementById("collectorMarkSoldBtn")
            .addEventListener("click", confirmCollectorSale);
    }

    // ------------------------------------------------------------
    // GENERATE HANDOVER TOKEN
    // ------------------------------------------------------------

    function generateCollectorHandoverToken() {

        if (!window.activeCollectorHandover) {
            return;
        }

        const token = window.activeCollectorHandover.token;

        const content = document.getElementById(
            "collectorHandoverContent"
        );

        const oldTokenBox = document.getElementById(
            "collectorTokenBox"
        );

        if (oldTokenBox) {
            oldTokenBox.remove();
        }

        const tokenBox = document.createElement("div");

        tokenBox.id = "collectorTokenBox";

        tokenBox.style.cssText = `
            margin-top:18px;
            padding:18px;
            background:#eef6ff;
            border:1px solid #b8d9ff;
            border-radius:14px;
            text-align:center;
        `;

        tokenBox.innerHTML = `

            <div style="
                font-size:13px;
                color:#555;
                margin-bottom:8px;
            ">
                🔐 DIGITAL HANDOVER TOKEN
            </div>

            <div style="
                font-size:25px;
                font-weight:800;
                letter-spacing:2px;
                word-break:break-all;
            ">
                ${token}
            </div>

            <div style="
                margin-top:8px;
                font-size:12px;
                color:#666;
            ">
                Show this reference to the recycler during handover.
            </div>

        `;

        content.appendChild(tokenBox);

        alert(
            "Handover token generated successfully."
        );
    }

    // ------------------------------------------------------------
    // CLOSE HANDOVER
    // ------------------------------------------------------------

    function closeCollectorHandover() {

        const modal = document.getElementById(
            "collectorHandoverModal"
        );

        if (modal) {
            modal.style.display = "none";
        }
    }

    // ------------------------------------------------------------
    // UPDATE INVENTORY AFTER SALE
    // ------------------------------------------------------------

    function updateInventoryAfterSale(material, soldWeight) {

        const INVENTORY_KEY =
            "kabadiSetuCollectorInventory";

        let inventory = [];

        try {
            inventory = JSON.parse(
                localStorage.getItem(INVENTORY_KEY) || "[]"
            );

            if (!Array.isArray(inventory)) {
                inventory = [];
            }

        } catch (error) {
            console.error(
                "Step 5G: Inventory read failed.",
                error
            );

            return false;
        }

        let found = false;

        inventory = inventory
            .map(function (item) {

                if (
                    item &&
                    String(item.material).toLowerCase() ===
                    String(material).toLowerCase()
                ) {

                    found = true;

                    const currentWeight =
                        Number(
                            item.weight ??
                            item.physicalWeight ??
                            item.quantity ??
                            0
                        ) || 0;

                    const remainingWeight =
                        currentWeight - Number(soldWeight);

                    return {
                        ...item,
                        weight:
                            remainingWeight > 0
                                ? Number(remainingWeight.toFixed(2))
                                : 0
                    };
                }

                return item;
            })
            .filter(function (item) {

                const weight =
                    Number(
                        item.weight ??
                        item.physicalWeight ??
                        item.quantity ??
                        0
                    ) || 0;

                return weight > 0;
            });

        if (found) {

            localStorage.setItem(
                INVENTORY_KEY,
                JSON.stringify(inventory)
            );

            console.log(
                "✅ Step 5G: Inventory updated after sale."
            );

            return true;
        }

        console.warn(
            "Step 5G: Matching inventory item not found."
        );

        return false;
    }

    // ------------------------------------------------------------
    // CONFIRM SALE
    // ------------------------------------------------------------

    function confirmCollectorSale() {

        const handover =
            window.activeCollectorHandover;

        if (!handover) {
            alert("No active collector handover found.");
            return;
        }

        const confirmed = confirm(
            "Confirm that this material has been handed over to the selected recycler and mark it as SOLD?"
        );

        if (!confirmed) {
            return;
        }

        const inventoryUpdated =
            updateInventoryAfterSale(
                handover.material,
                handover.weight
            );

        if (!inventoryUpdated) {

            alert(
                "The matching inventory item could not be found. Sale was not recorded."
            );

            return;
        }

        const finalValue =
            Number(handover.rate) *
            Number(handover.weight);

        const sale = {

            id: handover.saleId,

            token: handover.token,

            material: handover.material,

            weight: Number(handover.weight),

            recycler: {
                name: handover.recycler.name,
                rate: Number(handover.rate),
                distance: handover.recycler.distance,
                rating: Number(handover.recycler.rating) || 0,
                authorization:
                    handover.recycler.authorization
            },

            rate: Number(handover.rate),

            estimatedValue:
                Number(handover.estimatedValue),

            finalValue: finalValue,

            status: "Sold",

            createdAt: handover.createdAt,

            completedAt:
                new Date().toISOString()

        };

        const sales =
            getCollectorSales();

        sales.unshift(sale);

        saveCollectorSales(sales);

        console.log(
            "🎉 STEP 5G COMPLETE"
        );

        console.log(
            "Collector Sale:",
            sale
        );

        showCollectorSaleReceipt(sale);

        window.activeCollectorHandover = null;

        // Clear selected recycler after successful sale
        window.collectorSelectedRecycler = null;

        // Refresh dashboard/inventory
        refreshCollectorInventoryUI();

    }

    // ------------------------------------------------------------
    // SALE RECEIPT
    // ------------------------------------------------------------

    function showCollectorSaleReceipt(sale) {

        const content =
            document.getElementById(
                "collectorHandoverContent"
            );

        if (!content) {
            return;
        }

        content.innerHTML = `

            <div style="
                text-align:center;
                padding:10px 0 20px;
            ">

                <div style="
                    width:70px;
                    height:70px;
                    border-radius:50%;
                    background:#dcfce7;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    margin:0 auto 15px;
                    font-size:35px;
                ">
                    ✓
                </div>

                <h2 style="
                    margin:0 0 8px;
                    color:#15803d;
                ">
                    Sale Completed
                </h2>

                <p style="
                    margin:0;
                    color:#666;
                ">
                    Material successfully marked as sold.
                </p>

            </div>


            <div style="
                background:#f7f8fa;
                border-radius:15px;
                padding:18px;
                margin-bottom:18px;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    margin-bottom:12px;
                ">
                    <span>Sale ID</span>
                    <strong>${sale.id}</strong>
                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    margin-bottom:12px;
                ">
                    <span>Material</span>
                    <strong>${sale.material}</strong>
                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    margin-bottom:12px;
                ">
                    <span>Weight</span>
                    <strong>${sale.weight} kg</strong>
                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    margin-bottom:12px;
                ">
                    <span>Recycler</span>
                    <strong>${sale.recycler.name}</strong>
                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    margin-bottom:12px;
                ">
                    <span>Rate</span>
                    <strong>${formatMoney(sale.rate)}/kg</strong>
                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    padding-top:12px;
                    border-top:1px solid #ddd;
                ">
                    <strong>Sale Value</strong>
                    <strong style="
                        font-size:22px;
                    ">
                        ${formatMoney(sale.finalValue)}
                    </strong>
                </div>

            </div>


            <div style="
                background:#eefbf1;
                border:1px solid #b8e5c2;
                border-radius:14px;
                padding:15px;
                margin-bottom:18px;
            ">

                <div style="
                    font-size:13px;
                    color:#555;
                    margin-bottom:6px;
                ">
                    DIGITAL TRACEABILITY
                </div>

                <div style="
                    font-size:13px;
                    line-height:1.7;
                ">

                    Collector Inventory
                    <br>
                    ↓
                    <br>
                    ${sale.material} — ${sale.weight} kg
                    <br>
                    ↓
                    <br>
                    ${sale.recycler.name}
                    <br>
                    ↓
                    <br>
                    <strong>♻️ SOLD / HANDED OVER</strong>

                </div>

            </div>


            <div style="
                display:flex;
                gap:10px;
            ">

                <button
                    id="closeCollectorReceiptBtn"
                    style="
                        width:100%;
                        padding:14px;
                        border:none;
                        border-radius:12px;
                        background:#111827;
                        color:white;
                        font-size:15px;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    Done
                </button>

            </div>

        `;

        document
            .getElementById("closeCollectorReceiptBtn")
            .addEventListener(
                "click",
                closeCollectorHandover
            );

        renderCollectorSalesHistory();
    }

    // ------------------------------------------------------------
    // REFRESH INVENTORY UI
    // ------------------------------------------------------------

    function refreshCollectorInventoryUI() {

        try {

            if (
                typeof window.renderCollectorInventory ===
                "function"
            ) {
                window.renderCollectorInventory();
            }

        } catch (error) {
            console.warn(
                "Step 5G: Inventory refresh skipped.",
                error
            );
        }

        try {

            if (
                typeof window.loadCollectorInventory ===
                "function"
            ) {
                window.loadCollectorInventory();
            }

        } catch (error) {
            console.warn(
                "Step 5G: Inventory loader refresh skipped.",
                error
            );
        }

        // Trigger dashboard refresh through click if available
        try {

            const dashboardButton =
                document.querySelector(
                    '[data-page="dashboard"], [data-section="dashboard"]'
                );

            if (dashboardButton) {
                // Do not force navigation.
                // Existing dashboard interval will refresh the UI.
            }

        } catch (error) {
            // Ignore UI refresh errors.
        }
    }

    // ------------------------------------------------------------
    // COLLECTOR SALES HISTORY CARD
    // ------------------------------------------------------------

    function renderCollectorSalesHistory() {

        const sales =
            getCollectorSales();

        let card =
            document.getElementById(
                "collectorSalesHistoryCard"
            );

        if (!card) {

            card = document.createElement("div");

            card.id =
                "collectorSalesHistoryCard";

            card.style.cssText = `
                margin-top:20px;
                background:#ffffff;
                border-radius:18px;
                padding:20px;
                box-shadow:0 5px 20px rgba(0,0,0,0.08);
            `;

            document.body.appendChild(card);
        }

        if (sales.length === 0) {

            card.innerHTML = `
                <h3 style="margin-top:0;">
                    📦 Collector Sale History
                </h3>

                <p style="
                    color:#777;
                    margin-bottom:0;
                ">
                    No completed collector sales yet.
                </p>
            `;

            return;
        }

        const latestSales =
            sales.slice(0, 5);

        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:15px;
            ">

                <h3 style="margin:0;">
                    📦 Collector Sale History
                </h3>

                <span style="
                    font-size:13px;
                    color:#666;
                ">
                    ${sales.length} sale${sales.length === 1 ? "" : "s"}
                </span>

            </div>

            <div>

                ${latestSales.map(function (sale) {

                    const date =
                        new Date(
                            sale.completedAt ||
                            sale.createdAt
                        );

                    return `

                        <div style="
                            padding:14px 0;
                            border-bottom:1px solid #eee;
                            cursor:pointer;
                        "
                        data-collector-sale-id="${sale.id}"
                        >

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                gap:10px;
                                margin-bottom:6px;
                            ">

                                <strong>
                                    ${sale.material}
                                </strong>

                                <strong>
                                    ${formatMoney(sale.finalValue)}
                                </strong>

                            </div>

                            <div style="
                                display:flex;
                                flex-wrap:wrap;
                                gap:12px;
                                font-size:12px;
                                color:#666;
                            ">

                                <span>
                                    ⚖️ ${sale.weight} kg
                                </span>

                                <span>
                                    ♻️ ${sale.recycler.name}
                                </span>

                                <span>
                                    ${date.toLocaleDateString("en-IN")}
                                </span>

                            </div>

                            <div style="
                                margin-top:6px;
                                font-size:11px;
                                color:#999;
                            ">
                                ${sale.id}
                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

        `;

        card
            .querySelectorAll(
                "[data-collector-sale-id]"
            )
            .forEach(function (row) {

                row.addEventListener(
                    "click",
                    function () {

                        const saleId =
                            this.getAttribute(
                                "data-collector-sale-id"
                            );

                        const sale =
                            sales.find(
                                function (item) {
                                    return item.id === saleId;
                                }
                            );

                        if (sale) {
                            showCollectorSaleDetails(sale);
                        }

                    }
                );

            });
    }

    // ------------------------------------------------------------
    // SALE DETAILS
    // ------------------------------------------------------------

    function showCollectorSaleDetails(sale) {

        const modal =
            document.getElementById(
                "collectorHandoverModal"
            );

        if (!modal) {
            createCollectorHandoverModal();
        }

        const content =
            document.getElementById(
                "collectorHandoverContent"
            );

        content.innerHTML = `

            <h2 style="margin-top:0;">
                📄 Sale Details
            </h2>

            <div style="
                background:#f7f8fa;
                padding:18px;
                border-radius:15px;
                line-height:1.9;
            ">

                <strong>Sale ID:</strong>
                ${sale.id}
                <br>

                <strong>Material:</strong>
                ${sale.material}
                <br>

                <strong>Weight:</strong>
                ${sale.weight} kg
                <br>

                <strong>Recycler:</strong>
                ${sale.recycler.name}
                <br>

                <strong>Recycler Rate:</strong>
                ${formatMoney(sale.rate)}/kg
                <br>

                <strong>Final Value:</strong>
                ${formatMoney(sale.finalValue)}
                <br>

                <strong>Status:</strong>
                <span style="color:#15803d;">
                    ${sale.status}
                </span>

            </div>

            <div style="
                margin-top:18px;
                background:#eefbf1;
                border-radius:15px;
                padding:18px;
            ">

                <strong>
                    🔗 Traceability
                </strong>

                <div style="
                    margin-top:10px;
                    line-height:1.8;
                ">

                    Collector Inventory
                    →
                    ${sale.material}
                    →
                    ${sale.recycler.name}
                    →
                    Recycling Chain

                </div>

            </div>

            <button
                id="closeCollectorSaleDetailsBtn"
                style="
                    width:100%;
                    margin-top:20px;
                    padding:14px;
                    border:none;
                    border-radius:12px;
                    background:#111827;
                    color:white;
                    cursor:pointer;
                    font-size:15px;
                    font-weight:600;
                "
            >
                Close
            </button>

        `;

        modal.style.display = "block";

        document
            .getElementById(
                "closeCollectorSaleDetailsBtn"
            )
            .addEventListener(
                "click",
                closeCollectorHandover
            );
    }

    // ------------------------------------------------------------
    // CONNECT STEP 5F "PROCEED TO HANDOVER"
    // ------------------------------------------------------------

    const originalPrepareRecyclerHandover =
        window.prepareRecyclerHandover;

    window.prepareRecyclerHandover =
        function () {

            /*
             * If a collector has selected a recycler through
             * Step 5F, open the collector-specific handover flow.
             *
             * Otherwise preserve the existing household/recycler
             * handover functionality.
             */

            if (
                window.collectorSelectedRecycler &&
                window.collectorSelectedRecycler.material &&
                Number(
                    window.collectorSelectedRecycler.weight
                ) > 0
            ) {

                console.log(
                    "📦 Step 5G: Opening collector handover."
                );

                openCollectorHandover(
                    getSelectedRecyclerData()
                );

                return;
            }

            if (
                typeof originalPrepareRecyclerHandover ===
                "function"
            ) {

                return originalPrepareRecyclerHandover();

            }

            console.warn(
                "Step 5G: No recycler handover function available."
            );

        };

    // ------------------------------------------------------------
    // PUBLIC FUNCTIONS
    // ------------------------------------------------------------

    window.openCollectorHandover =
        openCollectorHandover;

    window.getCollectorSales =
        getCollectorSales;

    window.renderCollectorSalesHistory =
        renderCollectorSalesHistory;

    window.showCollectorSaleDetails =
        showCollectorSaleDetails;

    // ------------------------------------------------------------
    // AUTO REFRESH
    // ------------------------------------------------------------

    setInterval(
        function () {
            renderCollectorSalesHistory();
        },
        2500
    );

    // Initial render
    setTimeout(
        function () {

            renderCollectorSalesHistory();

            console.log(
                "✅ Step 5G - Collector Sell / Handover Flow ready."
            );

        },
        1200
    );

})();

// ============================================================
// STEP 5H - COLLECTOR SALES DASHBOARD & EARNINGS
// ============================================================

(function () {

    console.log("🚀 Step 5H - Collector Sales Dashboard loaded.");

    const SALES_KEY = "kabadiSetuCollectorSales";

    // ------------------------------------------------------------
    // GET SALES
    // ------------------------------------------------------------

    function getSales() {

        try {

            const sales = JSON.parse(
                localStorage.getItem(SALES_KEY) || "[]"
            );

            return Array.isArray(sales) ? sales : [];

        } catch (error) {

            console.error(
                "Step 5H: Could not load sales.",
                error
            );

            return [];
        }
    }

    // ------------------------------------------------------------
    // FORMAT MONEY
    // ------------------------------------------------------------

    function money(value) {

        return "₹" + Number(value || 0).toLocaleString("en-IN");

    }

    // ------------------------------------------------------------
    // CREATE DASHBOARD CARD
    // ------------------------------------------------------------

    function createCollectorEarningsCard() {

        let card = document.getElementById(
            "collectorEarningsDashboardCard"
        );

        if (card) {
            return card;
        }

        card = document.createElement("div");

        card.id =
            "collectorEarningsDashboardCard";

        card.style.cssText = `
            margin-top:20px;
            background:#ffffff;
            border-radius:18px;
            padding:20px;
            box-shadow:0 5px 20px rgba(0,0,0,0.08);
        `;

        document.body.appendChild(card);

        return card;
    }

    // ------------------------------------------------------------
    // CALCULATE ANALYTICS
    // ------------------------------------------------------------

    function calculateCollectorAnalytics() {

        const sales = getSales();

        let totalEarnings = 0;
        let totalWeight = 0;
        let totalSales = sales.length;

        const recyclerStats = {};

        sales.forEach(function (sale) {

            const value =
                Number(
                    sale.finalValue ??
                    sale.estimatedValue ??
                    0
                ) || 0;

            const weight =
                Number(
                    sale.weight
                ) || 0;

            totalEarnings += value;

            totalWeight += weight;

            const recyclerName =
                sale.recycler &&
                sale.recycler.name
                    ? sale.recycler.name
                    : "Unknown Recycler";

            if (!recyclerStats[recyclerName]) {

                recyclerStats[recyclerName] = {
                    sales: 0,
                    weight: 0,
                    earnings: 0
                };

            }

            recyclerStats[recyclerName].sales += 1;

            recyclerStats[recyclerName].weight +=
                weight;

            recyclerStats[recyclerName].earnings +=
                value;

        });

        return {
            totalEarnings:
                Number(totalEarnings.toFixed(2)),

            totalWeight:
                Number(totalWeight.toFixed(2)),

            totalSales:
                totalSales,

            recyclerStats:
                recyclerStats
        };
    }

    // ------------------------------------------------------------
    // RENDER DASHBOARD
    // ------------------------------------------------------------

    function renderCollectorEarningsDashboard() {

        const card =
            createCollectorEarningsCard();

        const analytics =
            calculateCollectorAnalytics();

        const recyclerNames =
            Object.keys(
                analytics.recyclerStats
            );

        if (analytics.totalSales === 0) {

            card.innerHTML = `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:15px;
                ">

                    <h3 style="margin:0;">
                        💰 Collector Earnings
                    </h3>

                    <span style="
                        font-size:12px;
                        color:#777;
                    ">
                        Sales Dashboard
                    </span>

                </div>

                <div style="
                    text-align:center;
                    padding:25px 10px;
                    color:#777;
                ">

                    <div style="
                        font-size:40px;
                        margin-bottom:10px;
                    ">
                        📦
                    </div>

                    <strong>
                        No completed sales yet
                    </strong>

                    <p style="
                        font-size:13px;
                        margin-bottom:0;
                    ">
                        Complete a recycler handover to
                        start tracking your earnings.
                    </p>

                </div>

            `;

            return;
        }

        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:18px;
            ">

                <div>

                    <h3 style="
                        margin:0 0 4px;
                    ">
                        💰 Collector Earnings
                    </h3>

                    <div style="
                        font-size:12px;
                        color:#777;
                    ">
                        Recycling sales performance
                    </div>

                </div>

                <div style="
                    font-size:24px;
                ">
                    📊
                </div>

            </div>


            <!-- SUMMARY CARDS -->

            <div style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit,minmax(140px,1fr));
                gap:12px;
                margin-bottom:20px;
            ">


                <div style="
                    background:#f0fdf4;
                    border-radius:15px;
                    padding:16px;
                    border:1px solid #dcfce7;
                ">

                    <div style="
                        font-size:12px;
                        color:#666;
                    ">
                        TOTAL EARNINGS
                    </div>

                    <div style="
                        font-size:23px;
                        font-weight:800;
                        margin-top:6px;
                    ">
                        ${money(
                            analytics.totalEarnings
                        )}
                    </div>

                </div>


                <div style="
                    background:#eff6ff;
                    border-radius:15px;
                    padding:16px;
                    border:1px solid #dbeafe;
                ">

                    <div style="
                        font-size:12px;
                        color:#666;
                    ">
                        WEIGHT SOLD
                    </div>

                    <div style="
                        font-size:23px;
                        font-weight:800;
                        margin-top:6px;
                    ">
                        ${analytics.totalWeight}
                        kg
                    </div>

                </div>


                <div style="
                    background:#faf5ff;
                    border-radius:15px;
                    padding:16px;
                    border:1px solid #f3e8ff;
                ">

                    <div style="
                        font-size:12px;
                        color:#666;
                    ">
                        COMPLETED SALES
                    </div>

                    <div style="
                        font-size:23px;
                        font-weight:800;
                        margin-top:6px;
                    ">
                        ${analytics.totalSales}
                    </div>

                </div>

            </div>


            <!-- RECYCLER PERFORMANCE -->

            <div>

                <div style="
                    font-size:14px;
                    font-weight:700;
                    margin-bottom:10px;
                ">
                    ♻️ Recycler-wise Performance
                </div>


                ${recyclerNames.map(function (name) {

                    const stats =
                        analytics.recyclerStats[name];

                    return `

                        <div style="
                            padding:14px;
                            border:1px solid #eee;
                            border-radius:14px;
                            margin-bottom:10px;
                        ">

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                gap:10px;
                                margin-bottom:8px;
                            ">

                                <strong>
                                    ${name}
                                </strong>

                                <strong>
                                    ${money(
                                        stats.earnings
                                    )}
                                </strong>

                            </div>


                            <div style="
                                display:flex;
                                flex-wrap:wrap;
                                gap:12px;
                                font-size:12px;
                                color:#666;
                            ">

                                <span>
                                    📦 ${stats.sales}
                                    sale${stats.sales === 1 ? "" : "s"}
                                </span>

                                <span>
                                    ⚖️ ${stats.weight.toFixed(2)}
                                    kg
                                </span>

                                <span>
                                    💰 ${money(
                                        stats.earnings
                                    )}
                                </span>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>


            <!-- TRANSPARENCY NOTE -->

            <div style="
                margin-top:15px;
                padding:13px;
                border-radius:12px;
                background:#f8fafc;
                font-size:12px;
                color:#666;
                line-height:1.6;
            ">

                💡 <strong>Transparent Earnings:</strong>
                Earnings are calculated from completed
                collector sales recorded in Kabadi Setu.
                Final settlement is subject to actual
                physical weight and recycler rates.

            </div>

        `;

    }

    // ------------------------------------------------------------
    // ADD TO DASHBOARD
    // ------------------------------------------------------------

    function moveCardNearDashboard() {

        const card =
            document.getElementById(
                "collectorEarningsDashboardCard"
            );

        if (!card) {
            return;
        }

        /*
         * We intentionally do not force the card into an
         * existing container because the current dashboard
         * structure may vary.
         *
         * The card remains part of the existing page and
         * refreshes automatically.
         */

    }

    // ------------------------------------------------------------
    // REFRESH
    // ------------------------------------------------------------

    function refreshCollectorEarnings() {

        renderCollectorEarningsDashboard();

        moveCardNearDashboard();

    }

    // ------------------------------------------------------------
    // PUBLIC FUNCTION
    // ------------------------------------------------------------

    window.renderCollectorEarningsDashboard =
        renderCollectorEarningsDashboard;

    window.getCollectorSalesAnalytics =
        calculateCollectorAnalytics;

    // ------------------------------------------------------------
    // AUTO REFRESH
    // ------------------------------------------------------------

    setInterval(
        function () {

            refreshCollectorEarnings();

        },
        2500
    );

    // ------------------------------------------------------------
    // INITIAL LOAD
    // ------------------------------------------------------------

    setTimeout(
        function () {

            refreshCollectorEarnings();

            console.log(
                "✅ Step 5H - Collector Earnings Dashboard ready."
            );

        },
        1500
    );

})();

// ============================================================
// STEP 5I - COLLECTOR PROFILE & VERIFICATION
// ============================================================

(function () {

    console.log("🚀 Step 5I - Collector Profile loaded.");

    const PROFILE_KEY = "kabadiSetuCollectorProfile";
    const SALES_KEY = "kabadiSetuCollectorSales";
    const INVENTORY_KEY = "kabadiSetuCollectorInventory";

    // ------------------------------------------------------------
    // DEFAULT PROFILE
    // ------------------------------------------------------------

    const DEFAULT_PROFILE = {
        name: "Kabadi Setu Collector",
        phone: "",
        area: "Local Service Area",
        language: "Hindi",
        verified: true,
        joinedAt: new Date().toISOString(),
        trustScore: 4.8
    };

    // ------------------------------------------------------------
    // GET PROFILE
    // ------------------------------------------------------------

    function getCollectorProfile() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(PROFILE_KEY) || "null"
                );

            if (saved && typeof saved === "object") {
                return {
                    ...DEFAULT_PROFILE,
                    ...saved
                };
            }

        } catch (error) {

            console.warn(
                "Step 5I: Profile could not be loaded.",
                error
            );

        }

        return {
            ...DEFAULT_PROFILE
        };
    }

    // ------------------------------------------------------------
    // SAVE PROFILE
    // ------------------------------------------------------------

    function saveCollectorProfile(profile) {

        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(profile)
        );

        console.log(
            "✅ Step 5I: Collector profile saved."
        );
    }

    // ------------------------------------------------------------
    // GET SALES
    // ------------------------------------------------------------

    function getSales() {

        try {

            const sales =
                JSON.parse(
                    localStorage.getItem(SALES_KEY) || "[]"
                );

            return Array.isArray(sales)
                ? sales
                : [];

        } catch (error) {

            return [];

        }
    }

    // ------------------------------------------------------------
    // GET INVENTORY
    // ------------------------------------------------------------

    function getInventory() {

        try {

            const inventory =
                JSON.parse(
                    localStorage.getItem(
                        INVENTORY_KEY
                    ) || "[]"
                );

            return Array.isArray(inventory)
                ? inventory
                : [];

        } catch (error) {

            return [];

        }
    }

    // ------------------------------------------------------------
    // CALCULATE COLLECTOR STATS
    // ------------------------------------------------------------

    function calculateCollectorStats() {

        const sales =
            getSales();

        const inventory =
            getInventory();

        let totalWeightSold = 0;
        let totalEarnings = 0;

        sales.forEach(function (sale) {

            totalWeightSold +=
                Number(sale.weight) || 0;

            totalEarnings +=
                Number(
                    sale.finalValue ??
                    sale.estimatedValue ??
                    0
                ) || 0;

        });

        let inventoryWeight = 0;

        inventory.forEach(function (item) {

            inventoryWeight +=
                Number(
                    item.weight ??
                    item.physicalWeight ??
                    item.quantity ??
                    0
                ) || 0;

        });

        return {

            completedSales:
                sales.length,

            totalWeightSold:
                Number(
                    totalWeightSold.toFixed(2)
                ),

            totalEarnings:
                Number(
                    totalEarnings.toFixed(2)
                ),

            currentInventory:
                Number(
                    inventoryWeight.toFixed(2)
                )

        };

    }

    // ------------------------------------------------------------
    // COLLECTOR LEVEL
    // ------------------------------------------------------------

    function getCollectorLevel(sales) {

        if (sales >= 25) {
            return {
                title: "🏆 Recycling Champion",
                description:
                    "25+ successful recycler handovers"
            };
        }

        if (sales >= 10) {
            return {
                title: "🥇 Verified Recycler Partner",
                description:
                    "10+ successful recycler handovers"
            };
        }

        if (sales >= 5) {
            return {
                title: "🥈 Active Collector",
                description:
                    "5+ successful recycler handovers"
            };
        }

        return {
            title: "🌱 New Collector",
            description:
                "Start completing handovers to level up"
        };

    }

    // ------------------------------------------------------------
    // CREATE PROFILE CARD
    // ------------------------------------------------------------

    function createProfileCard() {

        let card =
            document.getElementById(
                "collectorProfileCard"
            );

        if (card) {
            return card;
        }

        card =
            document.createElement("div");

        card.id =
            "collectorProfileCard";

        card.style.cssText = `
            margin-top:20px;
            background:#ffffff;
            border-radius:18px;
            padding:20px;
            box-shadow:0 5px 20px rgba(0,0,0,0.08);
        `;

        document.body.appendChild(card);

        return card;

    }

    // ------------------------------------------------------------
    // RENDER PROFILE
    // ------------------------------------------------------------

    function renderCollectorProfile() {

        const card =
            createProfileCard();

        const profile =
            getCollectorProfile();

        const stats =
            calculateCollectorStats();

        const level =
            getCollectorLevel(
                stats.completedSales
            );

        card.innerHTML = `

            <!-- HEADER -->

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:15px;
                margin-bottom:20px;
            ">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:14px;
                ">

                    <div style="
                        width:58px;
                        height:58px;
                        border-radius:50%;
                        background:#f0fdf4;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:30px;
                    ">
                        👤
                    </div>

                    <div>

                        <h3 style="
                            margin:0 0 5px;
                        ">
                            ${profile.name}
                        </h3>

                        <div style="
                            font-size:12px;
                            color:#777;
                        ">
                            Collector ID: KS-COL-${String(
                                Math.abs(
                                    profile.name
                                        .split("")
                                        .reduce(
                                            function (a, c) {
                                                return (
                                                    (a << 5) -
                                                    a +
                                                    c.charCodeAt(0)
                                                ) |
                                                0;
                                            },
                                            0
                                        )
                                )
                            ).slice(0, 6)}
                        </div>

                    </div>

                </div>


                <div style="
                    padding:7px 10px;
                    border-radius:20px;
                    background:#dcfce7;
                    color:#15803d;
                    font-size:12px;
                    font-weight:700;
                    white-space:nowrap;
                ">
                    ${profile.verified
                        ? "✓ VERIFIED"
                        : "UNVERIFIED"}
                </div>

            </div>


            <!-- LEVEL -->

            <div style="
                background:#f8fafc;
                border-radius:15px;
                padding:16px;
                margin-bottom:18px;
            ">

                <div style="
                    font-size:12px;
                    color:#777;
                    margin-bottom:5px;
                ">
                    COLLECTOR LEVEL
                </div>

                <div style="
                    font-size:19px;
                    font-weight:800;
                ">
                    ${level.title}
                </div>

                <div style="
                    margin-top:5px;
                    font-size:12px;
                    color:#777;
                ">
                    ${level.description}
                </div>

            </div>


            <!-- PROFILE DETAILS -->

            <div style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit,minmax(150px,1fr));
                gap:10px;
                margin-bottom:18px;
            ">

                <div style="
                    padding:14px;
                    border:1px solid #eee;
                    border-radius:13px;
                ">

                    <div style="
                        font-size:11px;
                        color:#888;
                    ">
                        SERVICE AREA
                    </div>

                    <strong>
                        📍 ${profile.area}
                    </strong>

                </div>


                <div style="
                    padding:14px;
                    border:1px solid #eee;
                    border-radius:13px;
                ">

                    <div style="
                        font-size:11px;
                        color:#888;
                    ">
                        LANGUAGE
                    </div>

                    <strong>
                        🗣️ ${profile.language}
                    </strong>

                </div>


                <div style="
                    padding:14px;
                    border:1px solid #eee;
                    border-radius:13px;
                ">

                    <div style="
                        font-size:11px;
                        color:#888;
                    ">
                        TRUST SCORE
                    </div>

                    <strong>
                        ⭐ ${profile.trustScore}/5
                    </strong>

                </div>

            </div>


            <!-- PERFORMANCE -->

            <div style="
                font-size:14px;
                font-weight:700;
                margin-bottom:10px;
            ">
                📊 Collector Performance
            </div>


            <div style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit,minmax(130px,1fr));
                gap:10px;
            ">

                <div style="
                    background:#f0fdf4;
                    border-radius:13px;
                    padding:14px;
                ">

                    <div style="
                        font-size:11px;
                        color:#777;
                    ">
                        EARNINGS
                    </div>

                    <strong style="
                        font-size:19px;
                    ">
                        ₹${stats.totalEarnings.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>


                <div style="
                    background:#eff6ff;
                    border-radius:13px;
                    padding:14px;
                ">

                    <div style="
                        font-size:11px;
                        color:#777;
                    ">
                        WEIGHT SOLD
                    </div>

                    <strong style="
                        font-size:19px;
                    ">
                        ${stats.totalWeightSold} kg
                    </strong>

                </div>


                <div style="
                    background:#faf5ff;
                    border-radius:13px;
                    padding:14px;
                ">

                    <div style="
                        font-size:11px;
                        color:#777;
                    ">
                        HANDOVERS
                    </div>

                    <strong style="
                        font-size:19px;
                    ">
                        ${stats.completedSales}
                    </strong>

                </div>


                <div style="
                    background:#fff7ed;
                    border-radius:13px;
                    padding:14px;
                ">

                    <div style="
                        font-size:11px;
                        color:#777;
                    ">
                        CURRENT STOCK
                    </div>

                    <strong style="
                        font-size:19px;
                    ">
                        ${stats.currentInventory} kg
                    </strong>

                </div>

            </div>


            <!-- EDIT PROFILE -->

            <button
                id="editCollectorProfileBtn"
                style="
                    width:100%;
                    margin-top:18px;
                    padding:13px;
                    border:none;
                    border-radius:12px;
                    background:#111827;
                    color:white;
                    font-size:14px;
                    font-weight:600;
                    cursor:pointer;
                "
            >
                ✏️ Edit Collector Profile
            </button>

        `;

        const editButton =
            document.getElementById(
                "editCollectorProfileBtn"
            );

        if (editButton) {

            editButton.addEventListener(
                "click",
                openCollectorProfileEditor
            );

        }

    }

    // ------------------------------------------------------------
    // PROFILE EDITOR
    // ------------------------------------------------------------

    function openCollectorProfileEditor() {

        const profile =
            getCollectorProfile();

        let modal =
            document.getElementById(
                "collectorProfileEditor"
            );

        if (!modal) {

            modal =
                document.createElement("div");

            modal.id =
                "collectorProfileEditor";

            modal.innerHTML = `

                <div style="
                    position:fixed;
                    inset:0;
                    background:rgba(0,0,0,0.65);
                    z-index:99998;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:20px;
                ">

                    <div style="
                        width:min(500px,100%);
                        background:white;
                        border-radius:18px;
                        padding:24px;
                    ">

                        <h2 style="
                            margin-top:0;
                        ">
                            👤 Collector Profile
                        </h2>

                        <label style="
                            display:block;
                            margin-bottom:5px;
                            font-size:13px;
                        ">
                            Name
                        </label>

                        <input
                            id="collectorProfileName"
                            type="text"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:12px;
                                border:1px solid #ddd;
                                border-radius:10px;
                                margin-bottom:14px;
                            "
                        />


                        <label style="
                            display:block;
                            margin-bottom:5px;
                            font-size:13px;
                        ">
                            Phone
                        </label>

                        <input
                            id="collectorProfilePhone"
                            type="tel"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:12px;
                                border:1px solid #ddd;
                                border-radius:10px;
                                margin-bottom:14px;
                            "
                        />


                        <label style="
                            display:block;
                            margin-bottom:5px;
                            font-size:13px;
                        ">
                            Service Area
                        </label>

                        <input
                            id="collectorProfileArea"
                            type="text"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:12px;
                                border:1px solid #ddd;
                                border-radius:10px;
                                margin-bottom:14px;
                            "
                        />


                        <label style="
                            display:block;
                            margin-bottom:5px;
                            font-size:13px;
                        ">
                            Preferred Language
                        </label>

                        <select
                            id="collectorProfileLanguage"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:12px;
                                border:1px solid #ddd;
                                border-radius:10px;
                                margin-bottom:20px;
                            "
                        >

                            <option value="Hindi">
                                Hindi
                            </option>

                            <option value="Marathi">
                                Marathi
                            </option>

                            <option value="English">
                                English
                            </option>

                        </select>


                        <div style="
                            display:flex;
                            gap:10px;
                        ">

                            <button
                                id="cancelCollectorProfileBtn"
                                style="
                                    flex:1;
                                    padding:13px;
                                    border:1px solid #ddd;
                                    border-radius:10px;
                                    background:white;
                                    cursor:pointer;
                                "
                            >
                                Cancel
                            </button>

                            <button
                                id="saveCollectorProfileBtn"
                                style="
                                    flex:1;
                                    padding:13px;
                                    border:none;
                                    border-radius:10px;
                                    background:#111827;
                                    color:white;
                                    cursor:pointer;
                                    font-weight:600;
                                "
                            >
                                Save Profile
                            </button>

                        </div>

                    </div>

                </div>

            `;

            document.body.appendChild(modal);

        }

        modal.style.display = "block";

        document.getElementById(
            "collectorProfileName"
        ).value = profile.name;

        document.getElementById(
            "collectorProfilePhone"
        ).value = profile.phone;

        document.getElementById(
            "collectorProfileArea"
        ).value = profile.area;

        document.getElementById(
            "collectorProfileLanguage"
        ).value = profile.language;

        document.getElementById(
            "cancelCollectorProfileBtn"
        ).onclick = function () {

            modal.style.display = "none";

        };

        document.getElementById(
            "saveCollectorProfileBtn"
        ).onclick = function () {

            profile.name =
                document.getElementById(
                    "collectorProfileName"
                ).value.trim()
                || "Kabadi Setu Collector";

            profile.phone =
                document.getElementById(
                    "collectorProfilePhone"
                ).value.trim();

            profile.area =
                document.getElementById(
                    "collectorProfileArea"
                ).value.trim()
                || "Local Service Area";

            profile.language =
                document.getElementById(
                    "collectorProfileLanguage"
                ).value;

            saveCollectorProfile(profile);

            modal.style.display = "none";

            renderCollectorProfile();

            alert(
                "Collector profile updated successfully."
            );

        };

    }

    // ------------------------------------------------------------
    // PUBLIC FUNCTIONS
    // ------------------------------------------------------------

    window.getCollectorProfile =
        getCollectorProfile;

    window.saveCollectorProfile =
        saveCollectorProfile;

    window.renderCollectorProfile =
        renderCollectorProfile;

    window.calculateCollectorStats =
        calculateCollectorStats;

    // ------------------------------------------------------------
    // AUTO REFRESH
    // ------------------------------------------------------------

    setInterval(
        function () {

            renderCollectorProfile();

        },
        3000
    );

    // ------------------------------------------------------------
    // INITIAL LOAD
    // ------------------------------------------------------------

    setTimeout(
        function () {

            renderCollectorProfile();

            console.log(
                "✅ Step 5I - Collector Profile ready."
            );

        },
        1800
    );

})();

// ============================================================
// STEP 5J - COLLECTOR NOTIFICATIONS & ALERTS
// ============================================================

(function () {

    console.log("🚀 Step 5J - Notifications & Alerts loaded.");

    const NOTIFICATION_KEY =
        "kabadiSetuCollectorNotifications";

    // ------------------------------------------------------------
    // STORAGE
    // ------------------------------------------------------------

    function getNotifications() {

        try {

            const data = JSON.parse(
                localStorage.getItem(NOTIFICATION_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {

            console.error(
                "Step 5J: Notification storage error.",
                error
            );

            return [];
        }
    }

    function saveNotifications(notifications) {

        localStorage.setItem(
            NOTIFICATION_KEY,
            JSON.stringify(notifications)
        );

    }

    // ------------------------------------------------------------
    // CREATE NOTIFICATION
    // ------------------------------------------------------------

    function addCollectorNotification(
        title,
        message,
        type = "info"
    ) {

        const notifications =
            getNotifications();

        const notification = {

            id:
                "NT-" +
                Date.now() +
                "-" +
                Math.floor(
                    Math.random() * 1000
                ),

            title: title,

            message: message,

            type: type,

            read: false,

            createdAt:
                new Date().toISOString()

        };

        notifications.unshift(
            notification
        );

        // Keep latest 50 notifications
        const limited =
            notifications.slice(0, 50);

        saveNotifications(limited);

        renderNotificationUI();

        console.log(
            "🔔 Notification added:",
            notification
        );

        return notification;
    }

    // ------------------------------------------------------------
    // UNREAD COUNT
    // ------------------------------------------------------------

    function getUnreadCount() {

        return getNotifications()
            .filter(function (notification) {
                return !notification.read;
            })
            .length;

    }

    // ------------------------------------------------------------
    // FORMAT TIME
    // ------------------------------------------------------------

    function formatNotificationTime(
        dateString
    ) {

        const date =
            new Date(dateString);

        if (isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }

    // ------------------------------------------------------------
    // ICON
    // ------------------------------------------------------------

    function getNotificationIcon(
        type
    ) {

        switch (type) {

            case "success":
                return "✅";

            case "warning":
                return "⚠️";

            case "sale":
                return "💰";

            case "pickup":
                return "🚚";

            case "recycler":
                return "♻️";

            case "inventory":
                return "📦";

            case "achievement":
                return "🏆";

            default:
                return "🔔";

        }

    }

    // ------------------------------------------------------------
    // CREATE NOTIFICATION CARD
    // ------------------------------------------------------------

    function createNotificationCard() {

        let card =
            document.getElementById(
                "collectorNotificationsCard"
            );

        if (card) {
            return card;
        }

        card =
            document.createElement("div");

        card.id =
            "collectorNotificationsCard";

        card.style.cssText = `
            margin-top:20px;
            background:#ffffff;
            border-radius:18px;
            padding:20px;
            box-shadow:0 5px 20px rgba(0,0,0,0.08);
        `;

        document.body.appendChild(card);

        return card;

    }

    // ------------------------------------------------------------
    // RENDER NOTIFICATIONS
    // ------------------------------------------------------------

    function renderNotificationUI() {

        const card =
            createNotificationCard();

        const notifications =
            getNotifications();

        const unreadCount =
            getUnreadCount();

        if (notifications.length === 0) {

            card.innerHTML = `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:15px;
                ">

                    <div>
                        <h3 style="margin:0;">
                            🔔 Notifications
                        </h3>

                        <div style="
                            font-size:12px;
                            color:#777;
                            margin-top:4px;
                        ">
                            Collector activity updates
                        </div>
                    </div>

                </div>

                <div style="
                    text-align:center;
                    padding:25px 10px;
                    color:#777;
                ">

                    <div style="
                        font-size:38px;
                        margin-bottom:8px;
                    ">
                        🔕
                    </div>

                    <strong>
                        No notifications yet
                    </strong>

                    <p style="
                        font-size:13px;
                        margin-bottom:0;
                    ">
                        Your important activity updates
                        will appear here.
                    </p>

                </div>

            `;

            updateNotificationBell();

            return;
        }

        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:10px;
                margin-bottom:16px;
            ">

                <div>

                    <h3 style="margin:0;">
                        🔔 Notifications
                    </h3>

                    <div style="
                        font-size:12px;
                        color:#777;
                        margin-top:4px;
                    ">

                        ${unreadCount}
                        unread notification${unreadCount === 1 ? "" : "s"}

                    </div>

                </div>


                ${
                    unreadCount > 0
                    ? `
                        <button
                            id="markAllNotificationsReadBtn"
                            style="
                                border:none;
                                background:#f1f5f9;
                                padding:8px 12px;
                                border-radius:9px;
                                cursor:pointer;
                                font-size:12px;
                            "
                        >
                            ✓ Mark all read
                        </button>
                    `
                    : ""
                }

            </div>


            <div>

                ${
                    notifications
                        .slice(0, 10)
                        .map(function (notification) {

                            const background =
                                notification.read
                                    ? "#ffffff"
                                    : "#f8fafc";

                            return `

                                <div
                                    data-notification-id="${notification.id}"
                                    style="
                                        display:flex;
                                        gap:12px;
                                        padding:13px;
                                        margin-bottom:8px;
                                        border-radius:13px;
                                        border:1px solid #eeeeee;
                                        background:${background};
                                        cursor:pointer;
                                    "
                                >

                                    <div style="
                                        width:38px;
                                        height:38px;
                                        flex-shrink:0;
                                        border-radius:50%;
                                        background:#f1f5f9;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        font-size:19px;
                                    ">
                                        ${getNotificationIcon(
                                            notification.type
                                        )}
                                    </div>


                                    <div style="
                                        flex:1;
                                        min-width:0;
                                    ">

                                        <div style="
                                            display:flex;
                                            justify-content:space-between;
                                            gap:10px;
                                        ">

                                            <strong style="
                                                font-size:14px;
                                            ">
                                                ${notification.title}
                                            </strong>

                                            ${
                                                !notification.read
                                                ? `
                                                    <span style="
                                                        width:8px;
                                                        height:8px;
                                                        border-radius:50%;
                                                        background:#16a34a;
                                                        flex-shrink:0;
                                                        margin-top:5px;
                                                    "></span>
                                                `
                                                : ""
                                            }

                                        </div>


                                        <div style="
                                            margin-top:4px;
                                            font-size:12px;
                                            color:#666;
                                            line-height:1.5;
                                        ">
                                            ${notification.message}
                                        </div>


                                        <div style="
                                            margin-top:5px;
                                            font-size:10px;
                                            color:#999;
                                        ">
                                            ${formatNotificationTime(
                                                notification.createdAt
                                            )}
                                        </div>

                                    </div>

                                </div>

                            `;

                        })
                        .join("")
                }

            </div>

        `;


        // --------------------------------------------------------
        // MARK ALL READ
        // --------------------------------------------------------

        const markAll =
            document.getElementById(
                "markAllNotificationsReadBtn"
            );

        if (markAll) {

            markAll.onclick =
                function () {

                    markAllNotificationsRead();

                };

        }


        // --------------------------------------------------------
        // INDIVIDUAL NOTIFICATIONS
        // --------------------------------------------------------

        card
            .querySelectorAll(
                "[data-notification-id]"
            )
            .forEach(function (element) {

                element.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.getAttribute(
                                "data-notification-id"
                            );

                        markNotificationRead(id);

                    }
                );

            });


        updateNotificationBell();

    }

    // ------------------------------------------------------------
    // MARK ONE READ
    // ------------------------------------------------------------

    function markNotificationRead(id) {

        const notifications =
            getNotifications();

        const notification =
            notifications.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (notification) {

            notification.read = true;

            saveNotifications(
                notifications
            );

            renderNotificationUI();

        }

    }

    // ------------------------------------------------------------
    // MARK ALL READ
    // ------------------------------------------------------------

    function markAllNotificationsRead() {

        const notifications =
            getNotifications();

        notifications.forEach(
            function (notification) {

                notification.read = true;

            }
        );

        saveNotifications(
            notifications
        );

        renderNotificationUI();

        console.log(
            "✅ All notifications marked as read."
        );

    }

    // ------------------------------------------------------------
    // DELETE ALL NOTIFICATIONS
    // ------------------------------------------------------------

    function clearAllNotifications() {

        const confirmed =
            confirm(
                "Clear all collector notifications?"
            );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem(
            NOTIFICATION_KEY
        );

        renderNotificationUI();

    }

    // ------------------------------------------------------------
    // NOTIFICATION BELL
    // ------------------------------------------------------------

    function updateNotificationBell() {

        let bell =
            document.getElementById(
                "collectorNotificationBell"
            );

        if (!bell) {

            bell =
                document.createElement("button");

            bell.id =
                "collectorNotificationBell";

            bell.style.cssText = `
                position:fixed;
                right:22px;
                bottom:22px;
                width:52px;
                height:52px;
                border:none;
                border-radius:50%;
                background:#111827;
                color:white;
                font-size:22px;
                cursor:pointer;
                z-index:9990;
                box-shadow:0 5px 20px rgba(0,0,0,0.2);
            `;

            document.body.appendChild(
                bell
            );

            bell.onclick =
                function () {

                    const card =
                        document.getElementById(
                            "collectorNotificationsCard"
                        );

                    if (card) {

                        card.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                };

        }

        const unread =
            getUnreadCount();

        bell.innerHTML = `
            🔔
            ${
                unread > 0
                ? `
                    <span style="
                        position:absolute;
                        top:-3px;
                        right:-3px;
                        min-width:19px;
                        height:19px;
                        padding:0 4px;
                        border-radius:20px;
                        background:#dc2626;
                        color:white;
                        font-size:10px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-weight:700;
                    ">
                        ${unread > 99 ? "99+" : unread}
                    </span>
                `
                : ""
            }
        `;

    }

    // ------------------------------------------------------------
    // AUTOMATIC SALE NOTIFICATION
    // ------------------------------------------------------------

    function checkForNewSales() {

        const SALES_KEY =
            "kabadiSetuCollectorSales";

        try {

            const sales =
                JSON.parse(
                    localStorage.getItem(
                        SALES_KEY
                    ) || "[]"
                );

            if (!Array.isArray(sales)) {
                return;
            }

            const latestSale =
                sales[0];

            if (!latestSale) {
                return;
            }

            const processedKey =
                "kabadiSetuLastNotifiedSale";

            const lastNotified =
                localStorage.getItem(
                    processedKey
                );

            if (
                lastNotified !==
                latestSale.id
            ) {

                addCollectorNotification(
                    "Sale Completed",
                    `${latestSale.material} (${latestSale.weight} kg) sold to ${latestSale.recycler?.name || "recycler"} for approximately ₹${Number(latestSale.finalValue || 0).toLocaleString("en-IN")}.`,
                    "sale"
                );

                localStorage.setItem(
                    processedKey,
                    latestSale.id
                );

                checkCollectorAchievement(
                    sales.length
                );

            }

        } catch (error) {

            console.warn(
                "Step 5J: Sale notification check failed.",
                error
            );

        }

    }

    // ------------------------------------------------------------
    // ACHIEVEMENTS
    // ------------------------------------------------------------

    function checkCollectorAchievement(
        totalSales
    ) {

        const milestones = [
            {
                count: 1,
                key: "first-sale",
                title: "First Sale Completed",
                message:
                    "Your first recycler handover is complete. Welcome to the formal recycling chain!"
            },
            {
                count: 5,
                key: "five-sales",
                title: "Active Collector",
                message:
                    "You have completed 5 recycler handovers. Keep building your recycling network!"
            },
            {
                count: 10,
                key: "ten-sales",
                title: "Verified Recycler Partner",
                message:
                    "You have completed 10 recycler handovers. Your collection activity is growing!"
            },
            {
                count: 25,
                key: "twenty-five-sales",
                title: "Recycling Champion",
                message:
                    "25 successful handovers completed. You are making a measurable contribution to formal recycling."
            }
        ];

        milestones.forEach(
            function (milestone) {

                if (
                    totalSales >=
                    milestone.count
                ) {

                    const key =
                        "kabadiSetuAchievement_" +
                        milestone.key;

                    if (
                        localStorage.getItem(key)
                        !== "true"
                    ) {

                        addCollectorNotification(
                            milestone.title,
                            milestone.message,
                            "achievement"
                        );

                        localStorage.setItem(
                            key,
                            "true"
                        );

                    }

                }

            }
        );

    }

    // ------------------------------------------------------------
    // PUBLIC API
    // ------------------------------------------------------------

    window.addCollectorNotification =
        addCollectorNotification;

    window.getCollectorNotifications =
        getNotifications;

    window.getCollectorUnreadCount =
        getUnreadCount;

    window.markNotificationRead =
        markNotificationRead;

    window.markAllNotificationsRead =
        markAllNotificationsRead;

    window.clearAllCollectorNotifications =
        clearAllNotifications;

    window.renderCollectorNotifications =
        renderNotificationUI;

    // ------------------------------------------------------------
    // INITIAL LOAD
    // ------------------------------------------------------------

    setTimeout(
        function () {

            renderNotificationUI();

            checkForNewSales();

            console.log(
                "✅ Step 5J - Notifications system ready."
            );

        },
        2000
    );

    // ------------------------------------------------------------
    // AUTO REFRESH
    // ------------------------------------------------------------

    setInterval(
        function () {

            checkForNewSales();

            renderNotificationUI();

        },
        3000
    );

})();

// ============================================================
// STEP 5K - COLLECTOR PICKUP REQUEST MANAGEMENT
// Household → Pickup Request → Collector → Inventory
// ============================================================

(function () {

    console.log("🚀 Step 5K - Pickup Request Management loaded.");

    const PICKUP_KEY =
        "kabadiSetuPickupRequests";

    const INVENTORY_KEY =
        "kabadiSetuCollectorInventory";

    // ------------------------------------------------------------
    // STORAGE HELPERS
    // ------------------------------------------------------------

    function getPickupRequests() {

        try {

            const data = JSON.parse(
                localStorage.getItem(PICKUP_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {

            console.error(
                "Step 5K: Could not load pickup requests.",
                error
            );

            return [];
        }
    }


    function savePickupRequests(requests) {

        localStorage.setItem(
            PICKUP_KEY,
            JSON.stringify(requests)
        );

    }


    function getInventory() {

        try {

            const data = JSON.parse(
                localStorage.getItem(INVENTORY_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {

            return [];
        }
    }


    function saveInventory(inventory) {

        localStorage.setItem(
            INVENTORY_KEY,
            JSON.stringify(inventory)
        );

    }

    // ------------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------------

    function money(value) {

        return "₹" +
            Number(value || 0)
                .toLocaleString("en-IN");

    }


    function generatePickupId() {

        const now = new Date();

        const date =
            now.getFullYear().toString() +
            String(
                now.getMonth() + 1
            ).padStart(2, "0") +
            String(
                now.getDate()
            ).padStart(2, "0");

        const random =
            Math.floor(
                100000 +
                Math.random() * 900000
            );

        return "PK-" +
            date +
            "-" +
            random;
    }


    function formatDate(dateString) {

        const date =
            new Date(dateString);

        if (isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }

    // ------------------------------------------------------------
    // CREATE DEMO PICKUP REQUEST
    // ------------------------------------------------------------

    function createDemoPickupRequest() {

        const requests =
            getPickupRequests();

        const request = {

            id:
                generatePickupId(),

            customerName:
                "Demo Household",

            phone:
                "Not provided",

            address:
                "Nearby Pickup Location",

            material:
                "Mixed E-Waste",

            estimatedWeight:
                5,

            estimatedValue:
                600,

            status:
                "Pending",

            createdAt:
                new Date().toISOString(),

            acceptedAt:
                null,

            completedAt:
                null

        };

        requests.unshift(request);

        savePickupRequests(requests);

        renderPickupRequests();

        addPickupNotification(
            "New Pickup Request",
            "A new household pickup request has been added.",
            "pickup"
        );

        return request;

    }

    // ------------------------------------------------------------
    // PICKUP REQUEST CARD
    // ------------------------------------------------------------

    function createPickupCard() {

        let card =
            document.getElementById(
                "collectorPickupRequestsCard"
            );

        if (card) {
            return card;
        }

        card =
            document.createElement("div");

        card.id =
            "collectorPickupRequestsCard";

        card.style.cssText = `
            margin-top:20px;
            background:#ffffff;
            border-radius:18px;
            padding:20px;
            box-shadow:0 5px 20px rgba(0,0,0,0.08);
        `;

        document.body.appendChild(card);

        return card;

    }

    // ------------------------------------------------------------
    // RENDER PICKUP REQUESTS
    // ------------------------------------------------------------

    function renderPickupRequests() {

        const card =
            createPickupCard();

        const requests =
            getPickupRequests();

        const pending =
            requests.filter(
                function (request) {

                    return request.status === "Pending";

                }
            );

        card.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:10px;
                margin-bottom:18px;
            ">

                <div>

                    <h3 style="
                        margin:0 0 4px;
                    ">
                        🚚 Pickup Requests
                    </h3>

                    <div style="
                        font-size:12px;
                        color:#777;
                    ">
                        Household collection requests
                    </div>

                </div>


                <div style="
                    padding:7px 11px;
                    border-radius:20px;
                    background:#fff7ed;
                    color:#c2410c;
                    font-size:12px;
                    font-weight:700;
                ">
                    ${pending.length} Pending
                </div>

            </div>


            ${
                requests.length === 0

                ? `

                    <div style="
                        text-align:center;
                        padding:25px 10px;
                        color:#777;
                    ">

                        <div style="
                            font-size:40px;
                            margin-bottom:8px;
                        ">
                            📭
                        </div>

                        <strong>
                            No pickup requests
                        </strong>

                        <p style="
                            font-size:13px;
                            margin-bottom:0;
                        ">
                            New household requests will
                            appear here.
                        </p>

                    </div>

                `

                :

                requests
                    .slice(0, 10)
                    .map(
                        renderPickupRequest
                    )
                    .join("")
            }


            <button
                id="createDemoPickupBtn"
                style="
                    width:100%;
                    margin-top:15px;
                    padding:12px;
                    border:1px dashed #aaa;
                    border-radius:11px;
                    background:#fafafa;
                    cursor:pointer;
                    font-size:13px;
                "
            >
                🧪 Add Demo Pickup Request
            </button>

        `;


        const demoButton =
            document.getElementById(
                "createDemoPickupBtn"
            );

        if (demoButton) {

            demoButton.onclick =
                function () {

                    createDemoPickupRequest();

                };

        }


        attachPickupEvents();

    }

    // ------------------------------------------------------------
    // RENDER SINGLE REQUEST
    // ------------------------------------------------------------

    function renderPickupRequest(request) {

        let statusBackground =
            "#fff7ed";

        let statusColor =
            "#c2410c";

        if (request.status === "Accepted") {

            statusBackground =
                "#eff6ff";

            statusColor =
                "#1d4ed8";

        }

        if (request.status === "Completed") {

            statusBackground =
                "#f0fdf4";

            statusColor =
                "#15803d";

        }


        return `

            <div style="
                border:1px solid #eeeeee;
                border-radius:15px;
                padding:16px;
                margin-bottom:10px;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:10px;
                    margin-bottom:10px;
                ">

                    <div>

                        <strong style="
                            font-size:15px;
                        ">
                            ${request.material}
                        </strong>

                        <div style="
                            font-size:11px;
                            color:#999;
                            margin-top:4px;
                        ">
                            ${request.id}
                        </div>

                    </div>


                    <span style="
                        padding:5px 9px;
                        border-radius:15px;
                        background:${statusBackground};
                        color:${statusColor};
                        font-size:11px;
                        font-weight:700;
                    ">
                        ${request.status}
                    </span>

                </div>


                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(130px,1fr));
                    gap:8px;
                    font-size:12px;
                    color:#666;
                ">

                    <div>
                        👤 ${request.customerName}
                    </div>

                    <div>
                        ⚖️ ${
                            request.actualWeight ||
                            request.estimatedWeight ||
                            0
                        } kg
                    </div>

                    <div>
                        📍 ${request.address}
                    </div>

                    <div>
                        💰 ${
                            request.finalValue ||
                            request.estimatedValue
                                ? money(
                                    request.finalValue ||
                                    request.estimatedValue
                                )
                                : "To be calculated"
                        }
                    </div>

                </div>


                <div style="
                    margin-top:12px;
                    font-size:10px;
                    color:#999;
                ">
                    Requested:
                    ${formatDate(request.createdAt)}
                </div>


                ${
                    request.status === "Pending"

                    ? `

                        <button
                            class="acceptPickupBtn"
                            data-pickup-id="${request.id}"
                            style="
                                width:100%;
                                margin-top:13px;
                                padding:12px;
                                border:none;
                                border-radius:10px;
                                background:#2563eb;
                                color:white;
                                cursor:pointer;
                                font-weight:600;
                            "
                        >
                            🚚 Accept Pickup
                        </button>

                    `

                    : ""
                }


                ${
                    request.status === "Accepted"

                    ? `

                        <button
                            class="completePickupBtn"
                            data-pickup-id="${request.id}"
                            style="
                                width:100%;
                                margin-top:13px;
                                padding:12px;
                                border:none;
                                border-radius:10px;
                                background:#16a34a;
                                color:white;
                                cursor:pointer;
                                font-weight:600;
                            "
                        >
                            ⚖️ Complete Pickup
                        </button>

                    `

                    : ""
                }

            </div>

        `;

    }

    // ------------------------------------------------------------
    // ATTACH EVENTS
    // ------------------------------------------------------------

    function attachPickupEvents() {

        document
            .querySelectorAll(
                ".acceptPickupBtn"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            const id =
                                this.getAttribute(
                                    "data-pickup-id"
                                );

                            acceptPickup(id);

                        };

                }
            );


        document
            .querySelectorAll(
                ".completePickupBtn"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            const id =
                                this.getAttribute(
                                    "data-pickup-id"
                                );

                            openCompletePickupModal(id);

                        };

                }
            );

    }

    // ------------------------------------------------------------
    // ACCEPT PICKUP
    // ------------------------------------------------------------

    function acceptPickup(id) {

        const requests =
            getPickupRequests();

        const request =
            requests.find(
                function (item) {

                    return item.id === id;

                }
            );

        if (!request) {

            alert(
                "Pickup request not found."
            );

            return;

        }

        request.status =
            "Accepted";

        request.acceptedAt =
            new Date().toISOString();

        savePickupRequests(
            requests
        );

        addPickupNotification(
            "Pickup Accepted",
            `Pickup ${request.id} has been accepted by the collector.`,
            "pickup"
        );

        renderPickupRequests();

        alert(
            "Pickup accepted successfully."
        );

    }

    // ------------------------------------------------------------
    // COMPLETE PICKUP MODAL
    // ------------------------------------------------------------

    function openCompletePickupModal(id) {

        const requests =
            getPickupRequests();

        const request =
            requests.find(
                function (item) {

                    return item.id === id;

                }
            );

        if (!request) {
            return;
        }


        let modal =
            document.getElementById(
                "completePickupModal"
            );

        if (!modal) {

            modal =
                document.createElement("div");

            modal.id =
                "completePickupModal";

            modal.innerHTML = `

                <div style="
                    position:fixed;
                    inset:0;
                    background:rgba(0,0,0,0.65);
                    z-index:99999;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:20px;
                ">

                    <div style="
                        width:min(500px,100%);
                        background:white;
                        border-radius:18px;
                        padding:24px;
                    ">

                        <h2 style="
                            margin-top:0;
                        ">
                            ⚖️ Complete Pickup
                        </h2>

                        <p style="
                            color:#666;
                            font-size:13px;
                        ">
                            Enter the actual physical weight
                            after collecting the material.
                        </p>


                        <div style="
                            background:#f8fafc;
                            padding:13px;
                            border-radius:12px;
                            margin-bottom:15px;
                            font-size:13px;
                        ">

                            <strong>
                                ${request.material}
                            </strong>

                            <br>

                            Household:
                            ${request.customerName}

                            <br>

                            Estimated weight:
                            ${request.estimatedWeight || 0}
                            kg

                        </div>


                        <label style="
                            display:block;
                            font-size:13px;
                            margin-bottom:6px;
                        ">
                            Actual Physical Weight (kg)
                        </label>


                        <input
                            id="actualPickupWeight"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value="${
                                request.estimatedWeight || ""
                            }"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:12px;
                                border:1px solid #ddd;
                                border-radius:10px;
                                margin-bottom:18px;
                            "
                        />


                        <div style="
                            display:flex;
                            gap:10px;
                        ">

                            <button
                                id="cancelCompletePickupBtn"
                                style="
                                    flex:1;
                                    padding:13px;
                                    border:1px solid #ddd;
                                    border-radius:10px;
                                    background:white;
                                    cursor:pointer;
                                "
                            >
                                Cancel
                            </button>


                            <button
                                id="confirmCompletePickupBtn"
                                style="
                                    flex:1;
                                    padding:13px;
                                    border:none;
                                    border-radius:10px;
                                    background:#16a34a;
                                    color:white;
                                    font-weight:600;
                                    cursor:pointer;
                                "
                            >
                                Complete Pickup
                            </button>

                        </div>

                    </div>

                </div>

            `;

            document.body.appendChild(
                modal
            );

        }

        modal.style.display =
            "flex";

        document.getElementById(
            "cancelCompletePickupBtn"
        ).onclick =
            function () {

                modal.style.display =
                    "none";

            };


        document.getElementById(
            "confirmCompletePickupBtn"
        ).onclick =
            function () {

                const weight =
                    Number(
                        document.getElementById(
                            "actualPickupWeight"
                        ).value
                    );

                if (
                    !weight ||
                    weight <= 0
                ) {

                    alert(
                        "Please enter a valid physical weight."
                    );

                    return;

                }

                completePickup(
                    id,
                    weight
                );

                modal.style.display =
                    "none";

            };

    }

    // ------------------------------------------------------------
    // COMPLETE PICKUP
    // ------------------------------------------------------------

    function completePickup(
        id,
        actualWeight
    ) {

        const requests =
            getPickupRequests();

        const request =
            requests.find(
                function (item) {

                    return item.id === id;

                }
            );

        if (!request) {

            alert(
                "Pickup request not found."
            );

            return;

        }


        const rate =
            getMaterialRate(
                request.material
            );

        const finalValue =
            rate *
            Number(actualWeight);


        request.status =
            "Completed";

        request.actualWeight =
            Number(actualWeight);

        request.finalRate =
            rate;

        request.finalValue =
            Number(
                finalValue.toFixed(2)
            );

        request.completedAt =
            new Date().toISOString();


        savePickupRequests(
            requests
        );


        // Add collected material to inventory
        addMaterialToInventory(
            request.material,
            actualWeight,
            rate
        );


        addPickupNotification(
            "Pickup Completed",
            `${request.material} (${actualWeight} kg) has been collected and added to your inventory.`,
            "success"
        );


        renderPickupRequests();


        alert(
            `Pickup completed successfully.\n\n` +
            `Material: ${request.material}\n` +
            `Weight: ${actualWeight} kg\n` +
            `Indicative Value: ${money(finalValue)}`
        );

    }

    // ------------------------------------------------------------
    // MATERIAL RATE
    // ------------------------------------------------------------

    function getMaterialRate(
        material
    ) {

        const rates = {

            "Iron": 35,
            "Steel": 45,
            "Aluminium": 140,
            "Copper": 700,
            "Plastic": 25,
            "Glass": 15,
            "Books & Newspapers": 28,
            "Printed Circuit Board": 220,
            "Copper Cable": 380,
            "Lithium Battery": 105,
            "Mobile Phone": 3500,
            "Laptop": 280,
            "Display/LCD": 180,
            "Electric Motor": 300,
            "Mixed E-Waste": 120,
            "Mixed / Other Waste": 0

        };

        return Number(
            rates[material] || 0
        );

    }

    // ------------------------------------------------------------
    // ADD TO INVENTORY
    // ------------------------------------------------------------

    function addMaterialToInventory(
        material,
        weight,
        rate
    ) {

        const inventory =
            getInventory();

        const existing =
            inventory.find(
                function (item) {

                    return (
                        item &&
                        String(
                            item.material
                        ).toLowerCase() ===
                        String(
                            material
                        ).toLowerCase()
                    );

                }
            );


        if (existing) {

            const oldWeight =
                Number(
                    existing.weight ||
                    existing.physicalWeight ||
                    0
                );

            existing.weight =
                Number(
                    (
                        oldWeight +
                        Number(weight)
                    ).toFixed(2)
                );

            existing.rate =
                Number(rate);

            existing.updatedAt =
                new Date().toISOString();

        } else {

            inventory.push({

                id:
                    "INV-" +
                    Date.now(),

                material:
                    material,

                weight:
                    Number(
                        Number(weight)
                            .toFixed(2)
                    ),

                rate:
                    Number(rate),

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            });

        }


        saveInventory(
            inventory
        );


        console.log(
            "✅ Material added to collector inventory:",
            material,
            weight,
            "kg"
        );


        // Refresh existing inventory UI
        try {

            if (
                typeof window.renderCollectorInventory ===
                "function"
            ) {

                window.renderCollectorInventory();

            }

        } catch (error) {

            console.warn(
                "Inventory UI refresh skipped.",
                error
            );

        }

    }

    // ------------------------------------------------------------
    // NOTIFICATION BRIDGE
    // ------------------------------------------------------------

    function addPickupNotification(
        title,
        message,
        type
    ) {

        try {

            if (
                typeof window.addCollectorNotification ===
                "function"
            ) {

                window.addCollectorNotification(
                    title,
                    message,
                    type
                );

                return;

            }

        } catch (error) {

            console.warn(
                "Notification bridge failed.",
                error
            );

        }

        console.log(
            "🔔",
            title,
            message
        );

    }

    // ------------------------------------------------------------
    // PUBLIC API
    // ------------------------------------------------------------

    window.getPickupRequests =
        getPickupRequests;

    window.savePickupRequests =
        savePickupRequests;

    window.createDemoPickupRequest =
        createDemoPickupRequest;

    window.renderPickupRequests =
        renderPickupRequests;

    window.acceptPickup =
        acceptPickup;

    window.completePickup =
        completePickup;

    window.addMaterialToCollectorInventory =
        addMaterialToInventory;

    // ------------------------------------------------------------
    // INITIAL LOAD
    // ------------------------------------------------------------

    setTimeout(
        function () {

            renderPickupRequests();

            console.log(
                "✅ Step 5K - Pickup Request Management ready."
            );

        },
        2200
    );

    // ------------------------------------------------------------
    // AUTO REFRESH
    // ------------------------------------------------------------

    setInterval(
        function () {

            renderPickupRequests();

        },
        3000
    );

})();

// ============================================================
// STEP 5L - SEPARATE HOUSEHOLD & COLLECTOR DASHBOARDS
// Household Dashboard ≠ Collector Dashboard
// Collector flow: Household → Collector → Recycler
// ============================================================

(function () {

    console.log("🚀 Step 5L - Role Based Dashboards loaded.");

    // ------------------------------------------------------------
    // ROLE STORAGE
    // ------------------------------------------------------------

    const ROLE_KEY = "kabadiSetuActiveRole";

    let activeRole =
        localStorage.getItem(ROLE_KEY) || "household";


    // ------------------------------------------------------------
    // SAVE ROLE
    // ------------------------------------------------------------

    function saveRole(role) {

        activeRole = role;

        localStorage.setItem(
            ROLE_KEY,
            role
        );

    }


    // ------------------------------------------------------------
    // GET ROLE
    // ------------------------------------------------------------

    function getRole() {

        return (
            localStorage.getItem(
                ROLE_KEY
            ) || "household"
        );

    }


    // ------------------------------------------------------------
    // FIND NAVIGATION ITEMS
    // ------------------------------------------------------------

    function getNavItems() {

        return Array.from(
            document.querySelectorAll(
                ".nav-item"
            )
        );

    }


    // ------------------------------------------------------------
    // HIDE / SHOW NAVIGATION
    // ------------------------------------------------------------

    function configureNavigation(role) {

        const navItems =
            getNavItems();

        navItems.forEach(function (item) {

            const text =
                (
                    item.innerText ||
                    ""
                ).toLowerCase();

            item.style.display =
                "";

            // ====================================================
            // HOUSEHOLD NAVIGATION
            // ====================================================

            if (role === "household") {

                /*
                 * Household should focus on:
                 *
                 * Dashboard
                 * AI Scanner
                 * Recycler Network
                 * Transactions
                 *
                 * Collector-only features are hidden.
                 */

                if (
                    text.includes("inventory") ||
                    text.includes("earnings") ||
                    text.includes("pickup request")
                ) {

                    item.style.display =
                        "none";

                }

            }


            // ====================================================
            // COLLECTOR NAVIGATION
            // ====================================================

            if (role === "collector") {

                /*
                 * Collector should focus on:
                 *
                 * Dashboard
                 * Pickup Requests
                 * Inventory
                 * Recycler Network
                 * Earnings
                 * Transactions
                 */

                if (
                    text.includes("scanner")
                ) {

                    item.style.display =
                        "none";

                }

            }

        });

    }


    // ------------------------------------------------------------
    // HIDE COLLECTOR-ONLY DASHBOARD CARDS
    // ------------------------------------------------------------

    function configureDynamicCards(role) {

        const collectorCards = [

            "collectorProfileCard",
            "collectorEarningsDashboardCard",
            "collectorNotificationsCard",
            "collectorSalesHistoryCard",
            "collectorPickupRequestsCard",
            "collectorInventoryCard"

        ];

        collectorCards.forEach(function (id) {

            const element =
                document.getElementById(id);

            if (!element) {
                return;
            }

            if (role === "collector") {

                element.style.display =
                    "";

            } else {

                element.style.display =
                    "none";

            }

        });

    }


    // ------------------------------------------------------------
    // CREATE COLLECTOR DASHBOARD
    // ------------------------------------------------------------

    function createCollectorDashboard() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (!dashboard) {

            console.warn(
                "Step 5L: Dashboard section not found."
            );

            return;

        }


        dashboard.innerHTML = `

            <div
                id="collectorDashboardMain"
                style="
                    width:100%;
                "
            >

                <!-- ================================================= -->
                <!-- WELCOME -->
                <!-- ================================================= -->

                <div style="
                    background:linear-gradient(
                        135deg,
                        #ecfdf5,
                        #f0fdf4
                    );
                    border:1px solid #d1fae5;
                    border-radius:20px;
                    padding:24px;
                    margin-bottom:20px;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:15px;
                    ">

                        <div>

                            <div style="
                                font-size:12px;
                                color:#15803d;
                                font-weight:700;
                                letter-spacing:.5px;
                                margin-bottom:7px;
                            ">
                                COLLECTOR PORTAL
                            </div>

                            <h2 style="
                                margin:0 0 8px;
                                font-size:28px;
                            ">
                                ♻️ Collector Dashboard
                            </h2>

                            <p style="
                                margin:0;
                                color:#555;
                                line-height:1.6;
                                max-width:650px;
                            ">
                                Collect recyclable material from
                                households, manage your inventory,
                                compare authorized recyclers and
                                sell at the best available rate.
                            </p>

                        </div>


                        <div style="
                            font-size:45px;
                        ">
                            🚚
                        </div>

                    </div>

                </div>


                <!-- ================================================= -->
                <!-- MAIN FLOW -->
                <!-- ================================================= -->

                <div style="
                    background:#ffffff;
                    border-radius:20px;
                    padding:22px;
                    margin-bottom:20px;
                    box-shadow:0 5px 20px rgba(0,0,0,.06);
                ">

                    <div style="
                        font-size:13px;
                        color:#777;
                        font-weight:700;
                        margin-bottom:15px;
                        letter-spacing:.4px;
                    ">
                        COLLECTOR TO RECYCLER JOURNEY
                    </div>


                    <div style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(140px,1fr)
                            );
                        gap:10px;
                        align-items:center;
                    ">


                        <div style="
                            text-align:center;
                            padding:15px 8px;
                        ">

                            <div style="
                                font-size:30px;
                            ">
                                🏠
                            </div>

                            <strong>
                                Household
                            </strong>

                            <div style="
                                font-size:11px;
                                color:#777;
                                margin-top:4px;
                            ">
                                Waste Request
                            </div>

                        </div>


                        <div style="
                            text-align:center;
                            font-size:22px;
                            color:#16a34a;
                        ">
                            →
                        </div>


                        <div style="
                            text-align:center;
                            padding:15px 8px;
                            background:#f0fdf4;
                            border-radius:15px;
                        ">

                            <div style="
                                font-size:30px;
                            ">
                                🚚
                            </div>

                            <strong>
                                Collector
                            </strong>

                            <div style="
                                font-size:11px;
                                color:#777;
                                margin-top:4px;
                            ">
                                Collect & Manage
                            </div>

                        </div>


                        <div style="
                            text-align:center;
                            font-size:22px;
                            color:#16a34a;
                        ">
                            →
                        </div>


                        <div style="
                            text-align:center;
                            padding:15px 8px;
                        ">

                            <div style="
                                font-size:30px;
                            ">
                                ♻️
                            </div>

                            <strong>
                                Recycler
                            </strong>

                            <div style="
                                font-size:11px;
                                color:#777;
                                margin-top:4px;
                            ">
                                Formal Recycling
                            </div>

                        </div>

                    </div>

                </div>


                <!-- ================================================= -->
                <!-- QUICK ACTIONS -->
                <!-- ================================================= -->

                <div style="
                    margin-bottom:20px;
                ">

                    <div style="
                        font-size:16px;
                        font-weight:700;
                        margin-bottom:12px;
                    ">
                        ⚡ Quick Actions
                    </div>


                    <div style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(180px,1fr)
                            );
                        gap:12px;
                    ">


                        <button
                            id="collectorPickupAction"
                            style="
                                border:none;
                                border-radius:15px;
                                padding:18px;
                                background:#eff6ff;
                                cursor:pointer;
                                text-align:left;
                            "
                        >

                            <div style="
                                font-size:26px;
                                margin-bottom:8px;
                            ">
                                🚚
                            </div>

                            <strong>
                                Pickup Requests
                            </strong>

                            <div style="
                                font-size:12px;
                                color:#666;
                                margin-top:5px;
                            ">
                                Accept household requests
                            </div>

                        </button>


                        <button
                            id="collectorInventoryAction"
                            style="
                                border:none;
                                border-radius:15px;
                                padding:18px;
                                background:#f0fdf4;
                                cursor:pointer;
                                text-align:left;
                            "
                        >

                            <div style="
                                font-size:26px;
                                margin-bottom:8px;
                            ">
                                📦
                            </div>

                            <strong>
                                My Inventory
                            </strong>

                            <div style="
                                font-size:12px;
                                color:#666;
                                margin-top:5px;
                            ">
                                Manage collected material
                            </div>

                        </button>


                        <button
                            id="collectorRecyclerAction"
                            style="
                                border:none;
                                border-radius:15px;
                                padding:18px;
                                background:#faf5ff;
                                cursor:pointer;
                                text-align:left;
                            "
                        >

                            <div style="
                                font-size:26px;
                                margin-bottom:8px;
                            ">
                                ♻️
                            </div>

                            <strong>
                                Find Recycler
                            </strong>

                            <div style="
                                font-size:12px;
                                color:#666;
                                margin-top:5px;
                            ">
                                Compare recycler rates
                            </div>

                        </button>


                        <button
                            id="collectorEarningsAction"
                            style="
                                border:none;
                                border-radius:15px;
                                padding:18px;
                                background:#fff7ed;
                                cursor:pointer;
                                text-align:left;
                            "
                        >

                            <div style="
                                font-size:26px;
                                margin-bottom:8px;
                            ">
                                💰
                            </div>

                            <strong>
                                Earnings
                            </strong>

                            <div style="
                                font-size:12px;
                                color:#666;
                                margin-top:5px;
                            ">
                                Track your sales
                            </div>

                        </button>

                    </div>

                </div>


                <!-- ================================================= -->
                <!-- LIVE STATUS -->
                <!-- ================================================= -->

                <div style="
                    background:#ffffff;
                    border-radius:20px;
                    padding:22px;
                    box-shadow:0 5px 20px rgba(0,0,0,.06);
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:15px;
                    ">

                        <div>

                            <h3 style="
                                margin:0 0 4px;
                            ">
                                📊 Collection Overview
                            </h3>

                            <div style="
                                font-size:12px;
                                color:#777;
                            ">
                                Your collector activity
                            </div>

                        </div>

                        <span style="
                            padding:7px 11px;
                            border-radius:20px;
                            background:#dcfce7;
                            color:#15803d;
                            font-size:11px;
                            font-weight:700;
                        ">
                            ACTIVE
                        </span>

                    </div>


                    <div style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(130px,1fr)
                            );
                        gap:10px;
                    ">


                        <div style="
                            background:#f8fafc;
                            padding:15px;
                            border-radius:13px;
                        ">

                            <div style="
                                font-size:11px;
                                color:#777;
                            ">
                                PICKUPS
                            </div>

                            <strong
                                id="collectorDashboardPickups"
                                style="
                                    font-size:22px;
                                "
                            >
                                0
                            </strong>

                        </div>


                        <div style="
                            background:#f8fafc;
                            padding:15px;
                            border-radius:13px;
                        ">

                            <div style="
                                font-size:11px;
                                color:#777;
                            ">
                                INVENTORY
                            </div>

                            <strong
                                id="collectorDashboardInventory"
                                style="
                                    font-size:22px;
                                "
                            >
                                0 kg
                            </strong>

                        </div>


                        <div style="
                            background:#f8fafc;
                            padding:15px;
                            border-radius:13px;
                        ">

                            <div style="
                                font-size:11px;
                                color:#777;
                            ">
                                SALES
                            </div>

                            <strong
                                id="collectorDashboardSales"
                                style="
                                    font-size:22px;
                                "
                            >
                                0
                            </strong>

                        </div>


                        <div style="
                            background:#f8fafc;
                            padding:15px;
                            border-radius:13px;
                        ">

                            <div style="
                                font-size:11px;
                                color:#777;
                            ">
                                EARNINGS
                            </div>

                            <strong
                                id="collectorDashboardEarnings"
                                style="
                                    font-size:22px;
                                "
                            >
                                ₹0
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- ================================================= -->
                <!-- INFO -->
                <!-- ================================================= -->

                <div style="
                    margin-top:18px;
                    padding:15px;
                    background:#f8fafc;
                    border-radius:14px;
                    font-size:12px;
                    color:#666;
                    line-height:1.6;
                ">

                    🛡️ <strong>Formal Recycling Chain:</strong>
                    Kabadi Setu helps collectors move material
                    from household collection into the formal
                    recycling network through verified recycler
                    matching, transparent pricing and digital
                    traceability.

                </div>

            </div>

        `;


        // --------------------------------------------------------
        // QUICK ACTION BUTTONS
        // --------------------------------------------------------

        document
            .getElementById(
                "collectorPickupAction"
            )
            .onclick =
                function () {

                    showSectionSafe(
                        "pickupRequests"
                    );

                };


        document
            .getElementById(
                "collectorInventoryAction"
            )
            .onclick =
                function () {

                    showSectionSafe(
                        "inventory"
                    );

                };


        document
            .getElementById(
                "collectorRecyclerAction"
            )
            .onclick =
                function () {

                    showSectionSafe(
                        "recyclers"
                    );

                };


        document
            .getElementById(
                "collectorEarningsAction"
            )
            .onclick =
                function () {

                    showSectionSafe(
                        "earnings"
                    );

                };


        updateCollectorDashboardStats();

    }


    // ------------------------------------------------------------
    // SAFE SECTION NAVIGATION
    // ------------------------------------------------------------

    function showSectionSafe(
        sectionId
    ) {

        if (
            typeof window.showSection ===
            "function"
        ) {

            window.showSection(
                sectionId
            );

        } else {

            const section =
                document.getElementById(
                    sectionId
                );

            if (section) {

                document
                    .querySelectorAll(
                        ".page-section"
                    )
                    .forEach(
                        function (item) {

                            item.classList.remove(
                                "active-section"
                            );

                        }
                    );

                section.classList.add(
                    "active-section"
                );

            }

        }

    }


    // ------------------------------------------------------------
    // COLLECTOR DASHBOARD STATS
    // ------------------------------------------------------------

    function updateCollectorDashboardStats() {

        const dashboard =
            document.getElementById(
                "collectorDashboardMain"
            );

        if (!dashboard) {
            return;
        }


        // --------------------------------------------------------
        // PICKUPS
        // --------------------------------------------------------

        let pickups = [];

        try {

            pickups =
                JSON.parse(
                    localStorage.getItem(
                        "kabadiSetuPickupRequests"
                    ) || "[]"
                );

            if (!Array.isArray(pickups)) {
                pickups = [];
            }

        } catch (error) {

            pickups = [];

        }


        // --------------------------------------------------------
        // INVENTORY
        // --------------------------------------------------------

        let inventory = [];

        try {

            inventory =
                JSON.parse(
                    localStorage.getItem(
                        "kabadiSetuCollectorInventory"
                    ) || "[]"
                );

            if (!Array.isArray(inventory)) {
                inventory = [];
            }

        } catch (error) {

            inventory = [];

        }


        let inventoryWeight = 0;

        inventory.forEach(
            function (item) {

                inventoryWeight +=
                    Number(
                        item.weight ??
                        item.physicalWeight ??
                        item.quantity ??
                        0
                    ) || 0;

            }
        );


        // --------------------------------------------------------
        // SALES
        // --------------------------------------------------------

        let sales = [];

        try {

            sales =
                JSON.parse(
                    localStorage.getItem(
                        "kabadiSetuCollectorSales"
                    ) || "[]"
                );

            if (!Array.isArray(sales)) {
                sales = [];
            }

        } catch (error) {

            sales = [];

        }


        let earnings = 0;

        sales.forEach(
            function (sale) {

                earnings +=
                    Number(
                        sale.finalValue ??
                        sale.estimatedValue ??
                        0
                    ) || 0;

            }
        );


        // --------------------------------------------------------
        // UPDATE DOM
        // --------------------------------------------------------

        const pickupElement =
            document.getElementById(
                "collectorDashboardPickups"
            );

        const inventoryElement =
            document.getElementById(
                "collectorDashboardInventory"
            );

        const salesElement =
            document.getElementById(
                "collectorDashboardSales"
            );

        const earningsElement =
            document.getElementById(
                "collectorDashboardEarnings"
            );


        if (pickupElement) {

            pickupElement.innerText =
                pickups.filter(
                    function (item) {

                        return (
                            item.status ===
                            "Pending"
                        );

                    }
                ).length;

        }


        if (inventoryElement) {

            inventoryElement.innerText =
                Number(
                    inventoryWeight.toFixed(2)
                ) + " kg";

        }


        if (salesElement) {

            salesElement.innerText =
                sales.length;

        }


        if (earningsElement) {

            earningsElement.innerText =
                "₹" +
                Number(
                    earnings.toFixed(2)
                ).toLocaleString(
                    "en-IN"
                );

        }

    }


    // ------------------------------------------------------------
    // SET PAGE TITLE
    // ------------------------------------------------------------

    function setPageTitle(
        role,
        section
    ) {

        const title =
            document.getElementById(
                "pageTitle"
            );

        if (!title) {
            return;
        }


        if (role === "collector") {

            const collectorTitles = {

                dashboard:
                    "Collector Dashboard",

                pickupRequests:
                    "Pickup Requests",

                inventory:
                    "My Inventory",

                recyclers:
                    "Recycler Network",

                earnings:
                    "Collector Earnings",

                transactions:
                    "Collector Transactions"

            };

            title.innerText =
                collectorTitles[section]
                ||
                "Collector Dashboard";

            return;

        }


        const householdTitles = {

            dashboard:
                "Household Dashboard",

            scanner:
                "AI Waste Scanner",

            recyclers:
                "Recycler Network",

            transactions:
                "My Transactions"

        };

        title.innerText =
            householdTitles[section]
            ||
            "Household Dashboard";

    }


    // ------------------------------------------------------------
    // UPDATE PROFILE ROLE
    // ------------------------------------------------------------

    function updateRoleText(
        role
    ) {

        const profileRole =
            document.querySelector(
                ".profile-role"
            );

        if (profileRole) {

            profileRole.innerText =
                role === "collector"
                    ? "Collector"
                    : "Household User";

        }


        document
            .querySelectorAll(
                ".profile-row"
            )
            .forEach(
                function (row) {

                    if (
                        row.innerText &&
                        row.innerText
                            .toLowerCase()
                            .includes("role")
                    ) {

                        const strong =
                            row.querySelector(
                                "strong"
                            );

                        if (strong) {

                            strong.innerText =
                                role === "collector"
                                    ? "Collector"
                                    : "Household";

                        }

                    }

                }
            );

    }


    // ------------------------------------------------------------
    // ROLE SWITCH
    // ------------------------------------------------------------

    window.switchRole =
        function (role) {

            if (
                role !== "household" &&
                role !== "collector"
            ) {

                role =
                    "household";

            }


            saveRole(role);


            // ----------------------------------------------------
            // ROLE BUTTONS
            // ----------------------------------------------------

            const householdButton =
                document.getElementById(
                    "householdRole"
                );

            const collectorButton =
                document.getElementById(
                    "collectorRole"
                );


            if (householdButton) {

                householdButton.classList.toggle(
                    "active",
                    role === "household"
                );

            }


            if (collectorButton) {

                collectorButton.classList.toggle(
                    "active",
                    role === "collector"
                );

            }


            // ----------------------------------------------------
            // PROFILE
            // ----------------------------------------------------

            updateRoleText(
                role
            );


            // ----------------------------------------------------
            // NAVIGATION
            // ----------------------------------------------------

            configureNavigation(
                role
            );


            // ----------------------------------------------------
            // COLLECTOR MODE
            // ----------------------------------------------------

            if (role === "collector") {

                createCollectorDashboard();

                configureDynamicCards(
                    "collector"
                );

                setPageTitle(
                    "collector",
                    "dashboard"
                );

                showCollectorDashboardSection();

                updateCollectorDashboardStats();

                console.log(
                    "🚚 Collector mode active."
                );

                return;

            }


            // ----------------------------------------------------
            // HOUSEHOLD MODE
            // ----------------------------------------------------

            configureDynamicCards(
                "household"
            );


            restoreHouseholdDashboard();


            setPageTitle(
                "household",
                "dashboard"
            );


            showHouseholdDashboardSection();


            console.log(
                "🏠 Household mode active."
            );

        };


    // ------------------------------------------------------------
    // SHOW COLLECTOR DASHBOARD
    // ------------------------------------------------------------

    function showCollectorDashboardSection() {

        const sections =
            document.querySelectorAll(
                ".page-section"
            );

        sections.forEach(
            function (section) {

                section.classList.remove(
                    "active-section"
                );

            }
        );


        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (dashboard) {

            dashboard.classList.add(
                "active-section"
            );

        }


        // Remove nav active state
        getNavItems().forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

                const text =
                    (
                        item.innerText ||
                        ""
                    ).toLowerCase();

                if (
                    text.includes(
                        "dashboard"
                    )
                ) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    // ------------------------------------------------------------
    // HOUSEHOLD DASHBOARD BACKUP
    // ------------------------------------------------------------

    let householdDashboardHTML =
        null;


    function saveHouseholdDashboard() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (
            dashboard &&
            householdDashboardHTML === null
        ) {

            householdDashboardHTML =
                dashboard.innerHTML;

        }

    }


    // ------------------------------------------------------------
    // RESTORE HOUSEHOLD DASHBOARD
    // ------------------------------------------------------------

    function restoreHouseholdDashboard() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (
            !dashboard
        ) {

            return;

        }


        if (
            householdDashboardHTML !== null
        ) {

            dashboard.innerHTML =
                householdDashboardHTML;

        }

    }


    function showHouseholdDashboardSection() {

        const sections =
            document.querySelectorAll(
                ".page-section"
            );

        sections.forEach(
            function (section) {

                section.classList.remove(
                    "active-section"
                );

            }
        );


        const dashboard =
            document.getElementById(
                "dashboard"
            );

        if (dashboard) {

            dashboard.classList.add(
                "active-section"
            );

        }


        getNavItems().forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

                const text =
                    (
                        item.innerText ||
                        ""
                    ).toLowerCase();

                if (
                    text.includes(
                        "dashboard"
                    )
                ) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    // ------------------------------------------------------------
    // ROLE-AWARE SECTION NAVIGATION
    // ------------------------------------------------------------

    const originalShowSection =
        window.showSection;


    window.showSection =
        function (sectionId) {

            const role =
                getRole();


            // ====================================================
            // COLLECTOR
            // ====================================================

            if (
                role === "collector"
            ) {

                const collectorAllowed = [

                    "dashboard",
                    "pickupRequests",
                    "pickup",
                    "inventory",
                    "recyclers",
                    "earnings",
                    "transactions"

                ];


                if (
                    sectionId === "scanner"
                ) {

                    console.log(
                        "Step 5L: AI Scanner hidden from collector."
                    );

                    return;

                }


                if (
                    typeof originalShowSection ===
                    "function"
                ) {

                    originalShowSection(
                        sectionId
                    );

                }


                configureNavigation(
                    "collector"
                );


                setPageTitle(
                    "collector",
                    sectionId
                );


                if (
                    sectionId ===
                    "dashboard"
                ) {

                    createCollectorDashboard();

                    showCollectorDashboardSection();

                    updateCollectorDashboardStats();

                }

                return;

            }


            // ====================================================
            // HOUSEHOLD
            // ====================================================

            if (
                typeof originalShowSection ===
                "function"
            ) {

                originalShowSection(
                    sectionId
                );

            }


            configureNavigation(
                "household"
            );


            setPageTitle(
                "household",
                sectionId
            );

        };


    // ------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------

    setTimeout(
        function () {

            /*
             * Save the original household dashboard before
             * switching it to collector mode.
             */

            saveHouseholdDashboard();


            const savedRole =
                getRole();


            window.switchRole(
                savedRole
            );


            console.log(
                "✅ Step 5L - Separate dashboards initialized."
            );

        },
        100
    );


    // ------------------------------------------------------------
    // KEEP COLLECTOR STATS UPDATED
    // ------------------------------------------------------------

    setInterval(
        function () {

            if (
                getRole() ===
                "collector"
            ) {

                updateCollectorDashboardStats();

            }

        },
        2000
    );


})();

// ============================================================
// STEP 5M - DEDICATED COLLECTOR PICKUP REQUEST PAGE
// ============================================================

(function () {

    console.log("🚀 Step 5M - Collector Pickup Requests page loaded.");

    const PICKUP_KEY = "kabadiSetuPickupRequests";

    // ============================================================
    // STORAGE
    // ============================================================

    function getRequests() {

        try {

            const data = JSON.parse(
                localStorage.getItem(PICKUP_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {

            console.error(
                "Step 5M: Error reading pickup requests.",
                error
            );

            return [];

        }

    }


    // ============================================================
    // MONEY
    // ============================================================

    function formatMoney(value) {

        return "₹" +
            Number(value || 0).toLocaleString("en-IN");

    }


    // ============================================================
    // DATE
    // ============================================================

    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    // ============================================================
    // CREATE SECTION
    // ============================================================

    function createPickupSection() {

        let section =
            document.getElementById(
                "pickupRequests"
            );

        if (section) {
            return section;
        }


        section =
            document.createElement("section");

        section.id =
            "pickupRequests";

        section.className =
            "page-section";


        section.innerHTML = `

            <div
                id="collectorPickupPage"
                style="
                    width:100%;
                "
            >

                <!-- ================================================= -->
                <!-- PAGE HEADER -->
                <!-- ================================================= -->

                <div style="
                    background:linear-gradient(
                        135deg,
                        #eff6ff,
                        #f0fdf4
                    );
                    border:1px solid #dbeafe;
                    border-radius:20px;
                    padding:24px;
                    margin-bottom:20px;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:15px;
                    ">

                        <div>

                            <div style="
                                font-size:12px;
                                font-weight:700;
                                color:#2563eb;
                                letter-spacing:.5px;
                                margin-bottom:6px;
                            ">
                                COLLECTION MANAGEMENT
                            </div>

                            <h2 style="
                                margin:0 0 7px;
                                font-size:27px;
                            ">
                                🚚 Pickup Requests
                            </h2>

                            <p style="
                                margin:0;
                                color:#666;
                                font-size:13px;
                                line-height:1.5;
                            ">
                                Manage household pickup requests,
                                accept collections and record
                                the actual physical weight.
                            </p>

                        </div>


                        <div style="
                            font-size:46px;
                        ">
                            📦
                        </div>

                    </div>

                </div>


                <!-- ================================================= -->
                <!-- STATISTICS -->
                <!-- ================================================= -->

                <div
                    id="pickupRequestStats"
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(140px,1fr)
                            );
                        gap:12px;
                        margin-bottom:20px;
                    "
                >
                </div>


                <!-- ================================================= -->
                <!-- FILTER -->
                <!-- ================================================= -->

                <div style="
                    background:#ffffff;
                    border-radius:17px;
                    padding:16px;
                    margin-bottom:15px;
                    box-shadow:0 4px 15px rgba(0,0,0,.05);
                ">

                    <div style="
                        display:flex;
                        gap:10px;
                        align-items:center;
                        flex-wrap:wrap;
                    ">

                        <strong style="
                            font-size:13px;
                        ">
                            Filter:
                        </strong>


                        <button
                            class="pickupFilterBtn"
                            data-filter="all"
                            style="
                                padding:8px 14px;
                                border:none;
                                border-radius:20px;
                                cursor:pointer;
                                background:#111827;
                                color:white;
                                font-size:12px;
                            "
                        >
                            All
                        </button>


                        <button
                            class="pickupFilterBtn"
                            data-filter="Pending"
                            style="
                                padding:8px 14px;
                                border:1px solid #fed7aa;
                                border-radius:20px;
                                cursor:pointer;
                                background:#fff7ed;
                                color:#c2410c;
                                font-size:12px;
                            "
                        >
                            Pending
                        </button>


                        <button
                            class="pickupFilterBtn"
                            data-filter="Accepted"
                            style="
                                padding:8px 14px;
                                border:1px solid #bfdbfe;
                                border-radius:20px;
                                cursor:pointer;
                                background:#eff6ff;
                                color:#1d4ed8;
                                font-size:12px;
                            "
                        >
                            Accepted
                        </button>


                        <button
                            class="pickupFilterBtn"
                            data-filter="Completed"
                            style="
                                padding:8px 14px;
                                border:1px solid #bbf7d0;
                                border-radius:20px;
                                cursor:pointer;
                                background:#f0fdf4;
                                color:#15803d;
                                font-size:12px;
                            "
                        >
                            Completed
                        </button>

                    </div>

                </div>


                <!-- ================================================= -->
                <!-- REQUEST LIST -->
                <!-- ================================================= -->

                <div
                    id="collectorPickupRequestList"
                >
                </div>

            </div>

        `;


        const main =
            document.querySelector(
                ".main"
            );


        if (main) {

            main.appendChild(
                section
            );

        } else {

            document.body.appendChild(
                section
            );

        }


        attachFilterButtons();

        return section;

    }


    // ============================================================
    // STATS
    // ============================================================

    function renderStats(requests) {

        const container =
            document.getElementById(
                "pickupRequestStats"
            );

        if (!container) {
            return;
        }


        const pending =
            requests.filter(
                r => r.status === "Pending"
            ).length;


        const accepted =
            requests.filter(
                r => r.status === "Accepted"
            ).length;


        const completed =
            requests.filter(
                r => r.status === "Completed"
            ).length;


        container.innerHTML = `

            <div style="
                background:#fff7ed;
                border-radius:15px;
                padding:17px;
                border:1px solid #fed7aa;
            ">

                <div style="
                    font-size:11px;
                    color:#9a3412;
                    font-weight:700;
                ">
                    PENDING
                </div>

                <div style="
                    font-size:25px;
                    font-weight:700;
                    margin-top:4px;
                ">
                    ${pending}
                </div>

                <div style="
                    font-size:11px;
                    color:#777;
                    margin-top:3px;
                ">
                    Need acceptance
                </div>

            </div>


            <div style="
                background:#eff6ff;
                border-radius:15px;
                padding:17px;
                border:1px solid #bfdbfe;
            ">

                <div style="
                    font-size:11px;
                    color:#1d4ed8;
                    font-weight:700;
                ">
                    ACCEPTED
                </div>

                <div style="
                    font-size:25px;
                    font-weight:700;
                    margin-top:4px;
                ">
                    ${accepted}
                </div>

                <div style="
                    font-size:11px;
                    color:#777;
                    margin-top:3px;
                ">
                    Ready for collection
                </div>

            </div>


            <div style="
                background:#f0fdf4;
                border-radius:15px;
                padding:17px;
                border:1px solid #bbf7d0;
            ">

                <div style="
                    font-size:11px;
                    color:#15803d;
                    font-weight:700;
                ">
                    COMPLETED
                </div>

                <div style="
                    font-size:25px;
                    font-weight:700;
                    margin-top:4px;
                ">
                    ${completed}
                </div>

                <div style="
                    font-size:11px;
                    color:#777;
                    margin-top:3px;
                ">
                    Successfully collected
                </div>

            </div>


            <div style="
                background:#f8fafc;
                border-radius:15px;
                padding:17px;
                border:1px solid #e5e7eb;
            ">

                <div style="
                    font-size:11px;
                    color:#475569;
                    font-weight:700;
                ">
                    TOTAL REQUESTS
                </div>

                <div style="
                    font-size:25px;
                    font-weight:700;
                    margin-top:4px;
                ">
                    ${requests.length}
                </div>

                <div style="
                    font-size:11px;
                    color:#777;
                    margin-top:3px;
                ">
                    All household requests
                </div>

            </div>

        `;

    }


    // ============================================================
    // RENDER REQUEST LIST
    // ============================================================

    let currentFilter = "all";


    function renderRequestList() {

        const container =
            document.getElementById(
                "collectorPickupRequestList"
            );

        if (!container) {
            return;
        }


        const requests =
            getRequests();


        renderStats(
            requests
        );


        let filtered =
            requests;


        if (
            currentFilter !==
            "all"
        ) {

            filtered =
                requests.filter(
                    function (request) {

                        return (
                            request.status ===
                            currentFilter
                        );

                    }
                );

        }


        if (
            filtered.length === 0
        ) {

            container.innerHTML = `

                <div style="
                    background:white;
                    border-radius:18px;
                    padding:45px 20px;
                    text-align:center;
                    box-shadow:0 4px 15px rgba(0,0,0,.05);
                ">

                    <div style="
                        font-size:48px;
                        margin-bottom:10px;
                    ">
                        📭
                    </div>

                    <h3 style="
                        margin:0 0 7px;
                    ">
                        No ${currentFilter === "all"
                            ? ""
                            : currentFilter.toLowerCase()
                        } requests
                    </h3>

                    <p style="
                        margin:0;
                        color:#777;
                        font-size:13px;
                    ">
                        Household pickup requests
                        will appear here.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            filtered
                .map(
                    renderRequestCard
                )
                .join("");


        attachRequestActions();

    }


    // ============================================================
    // REQUEST CARD
    // ============================================================

    function renderRequestCard(request) {

        let statusBg =
            "#fff7ed";

        let statusColor =
            "#c2410c";

        let statusBorder =
            "#fed7aa";


        if (
            request.status ===
            "Accepted"
        ) {

            statusBg =
                "#eff6ff";

            statusColor =
                "#1d4ed8";

            statusBorder =
                "#bfdbfe";

        }


        if (
            request.status ===
            "Completed"
        ) {

            statusBg =
                "#f0fdf4";

            statusColor =
                "#15803d";

            statusBorder =
                "#bbf7d0";

        }


        const weight =
            request.actualWeight ||
            request.estimatedWeight ||
            0;


        const value =
            request.finalValue ||
            request.estimatedValue ||
            0;


        return `

            <div style="
                background:#ffffff;
                border-radius:18px;
                padding:20px;
                margin-bottom:13px;
                border:1px solid #e5e7eb;
                box-shadow:0 4px 15px rgba(0,0,0,.05);
            ">

                <!-- TOP -->

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:15px;
                    margin-bottom:16px;
                ">

                    <div>

                        <div style="
                            font-size:11px;
                            color:#999;
                            margin-bottom:5px;
                        ">
                            PICKUP REQUEST
                        </div>

                        <h3 style="
                            margin:0;
                            font-size:17px;
                        ">
                            ${request.id}
                        </h3>

                    </div>


                    <span style="
                        padding:7px 12px;
                        border-radius:20px;
                        background:${statusBg};
                        color:${statusColor};
                        border:1px solid ${statusBorder};
                        font-size:11px;
                        font-weight:700;
                    ">
                        ${request.status}
                    </span>

                </div>


                <!-- HOUSEHOLD -->

                <div style="
                    background:#f8fafc;
                    border-radius:14px;
                    padding:15px;
                    margin-bottom:13px;
                ">

                    <div style="
                        font-size:11px;
                        color:#777;
                        margin-bottom:7px;
                    ">
                        HOUSEHOLD
                    </div>

                    <strong style="
                        font-size:15px;
                    ">
                        🏠 ${request.customerName || "Household User"}
                    </strong>

                    ${
                        request.phone
                            ? `
                                <div style="
                                    font-size:12px;
                                    color:#666;
                                    margin-top:5px;
                                ">
                                    📞 ${request.phone}
                                </div>
                              `
                            : ""
                    }

                </div>


                <!-- DETAILS -->

                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(150px,1fr)
                        );
                    gap:10px;
                    margin-bottom:15px;
                ">


                    <div style="
                        padding:12px;
                        background:#f8fafc;
                        border-radius:12px;
                    ">

                        <div style="
                            font-size:10px;
                            color:#888;
                        ">
                            MATERIAL
                        </div>

                        <strong style="
                            font-size:13px;
                        ">
                            ♻️ ${request.material}
                        </strong>

                    </div>


                    <div style="
                        padding:12px;
                        background:#f8fafc;
                        border-radius:12px;
                    ">

                        <div style="
                            font-size:10px;
                            color:#888;
                        ">
                            WEIGHT
                        </div>

                        <strong style="
                            font-size:13px;
                        ">
                            ⚖️ ${weight} kg
                        </strong>

                    </div>


                    <div style="
                        padding:12px;
                        background:#f8fafc;
                        border-radius:12px;
                    ">

                        <div style="
                            font-size:10px;
                            color:#888;
                        ">
                            ${
                                request.status ===
                                "Completed"
                                    ? "FINAL VALUE"
                                    : "ESTIMATED VALUE"
                            }
                        </div>

                        <strong style="
                            font-size:13px;
                        ">
                            💰 ${formatMoney(value)}
                        </strong>

                    </div>


                    <div style="
                        padding:12px;
                        background:#f8fafc;
                        border-radius:12px;
                    ">

                        <div style="
                            font-size:10px;
                            color:#888;
                        ">
                            REQUESTED
                        </div>

                        <strong style="
                            font-size:12px;
                        ">
                            🕒 ${formatDate(request.createdAt)}
                        </strong>

                    </div>

                </div>


                <!-- ADDRESS -->

                <div style="
                    padding:13px;
                    border:1px dashed #d1d5db;
                    border-radius:12px;
                    margin-bottom:15px;
                    font-size:12px;
                    color:#555;
                ">

                    <strong>
                        📍 Pickup Address
                    </strong>

                    <div style="
                        margin-top:5px;
                    ">
                        ${request.address || "Address not provided"}
                    </div>

                </div>


                <!-- ACTION -->

                ${
                    request.status ===
                    "Pending"

                    ? `

                        <button
                            class="collectorAcceptPickup"
                            data-id="${request.id}"
                            style="
                                width:100%;
                                padding:13px;
                                border:none;
                                border-radius:11px;
                                background:#2563eb;
                                color:white;
                                cursor:pointer;
                                font-weight:700;
                            "
                        >
                            🚚 Accept Pickup Request
                        </button>

                    `

                    : ""
                }


                ${
                    request.status ===
                    "Accepted"

                    ? `

                        <button
                            class="collectorCompletePickup"
                            data-id="${request.id}"
                            style="
                                width:100%;
                                padding:13px;
                                border:none;
                                border-radius:11px;
                                background:#16a34a;
                                color:white;
                                cursor:pointer;
                                font-weight:700;
                            "
                        >
                            ⚖️ Complete Pickup & Enter Weight
                        </button>

                    `

                    : ""
                }


                ${
                    request.status ===
                    "Completed"

                    ? `

                        <div style="
                            background:#f0fdf4;
                            border:1px solid #bbf7d0;
                            color:#15803d;
                            padding:12px;
                            border-radius:11px;
                            font-size:12px;
                            text-align:center;
                            font-weight:600;
                        ">
                            ✅ Material collected and added
                            to collector inventory
                        </div>

                    `

                    : ""
                }

            </div>

        `;

    }


    // ============================================================
    // ACTION EVENTS
    // ============================================================

    function attachRequestActions() {

        document
            .querySelectorAll(
                ".collectorAcceptPickup"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            const id =
                                this.getAttribute(
                                    "data-id"
                                );


                            if (
                                typeof window.acceptPickup ===
                                "function"
                            ) {

                                window.acceptPickup(
                                    id
                                );

                                setTimeout(
                                    renderRequestList,
                                    150
                                );

                            }

                        };

                }
            );


        document
            .querySelectorAll(
                ".collectorCompletePickup"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            const id =
                                this.getAttribute(
                                    "data-id"
                                );


                            if (
                                typeof window.openCompletePickupModal ===
                                "function"
                            ) {

                                window.openCompletePickupModal(
                                    id
                                );

                            } else if (
                                typeof window.completePickup ===
                                "function"
                            ) {

                                const weight =
                                    prompt(
                                        "Enter actual physical weight in kg:"
                                    );


                                if (
                                    weight &&
                                    Number(weight) > 0
                                ) {

                                    window.completePickup(
                                        id,
                                        Number(weight)
                                    );

                                    setTimeout(
                                        renderRequestList,
                                        150
                                    );

                                }

                            }

                        };

                }
            );

    }


    // ============================================================
    // FILTER BUTTONS
    // ============================================================

    function attachFilterButtons() {

        document
            .querySelectorAll(
                ".pickupFilterBtn"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            currentFilter =
                                this.getAttribute(
                                    "data-filter"
                                ) ||
                                "all";


                            document
                                .querySelectorAll(
                                    ".pickupFilterBtn"
                                )
                                .forEach(
                                    function (btn) {

                                        btn.style.fontWeight =
                                            "400";

                                    }
                                );


                            this.style.fontWeight =
                                "700";


                            renderRequestList();

                        };

                }
            );

    }


    // ============================================================
    // PUBLIC FUNCTION
    // ============================================================

    window.renderCollectorPickupPage =
        function () {

            createPickupSection();

            renderRequestList();

        };


    // ============================================================
    // ROLE-AWARE NAVIGATION BUTTON
    // ============================================================

    function addCollectorPickupNav() {

        const nav =
            document.querySelector(
                ".sidebar nav"
            );


        if (!nav) {
            return;
        }


        // Don't duplicate
        if (
            document.getElementById(
                "collectorPickupNavItem"
            )
        ) {

            return;

        }


        const button =
            document.createElement(
                "button"
            );


        button.id =
            "collectorPickupNavItem";

        button.className =
            "nav-item collector-only-nav";


        button.innerHTML = `
            <span>🚚</span>
            Pickup Requests
        `;


        button.style.display =
            getCurrentRole() ===
            "collector"
                ? ""
                : "none";


        button.onclick =
            function () {

                if (
                    getCurrentRole() !==
                    "collector"
                ) {

                    return;

                }


                if (
                    typeof window.showSection ===
                    "function"
                ) {

                    window.showSection(
                        "pickupRequests"
                    );

                }


                renderRequestList();

            };


        nav.insertBefore(
            button,
            nav.children[1] || null
        );

    }


    // ============================================================
    // CURRENT ROLE
    // ============================================================

    function getCurrentRole() {

        return (
            localStorage.getItem(
                "kabadiSetuActiveRole"
            ) ||
            "household"
        );

    }


    // ============================================================
    // ROLE BUTTON OBSERVER
    // ============================================================

    function updatePickupNavVisibility() {

        const nav =
            document.getElementById(
                "collectorPickupNavItem"
            );


        if (!nav) {
            return;
        }


        nav.style.display =
            getCurrentRole() ===
            "collector"
                ? ""
                : "none";

    }


    // ============================================================
    // PATCH ROLE SWITCH
    // ============================================================

    const oldSwitchRole =
        window.switchRole;


    if (
        typeof oldSwitchRole ===
        "function"
    ) {

        window.switchRole =
            function (role) {

                oldSwitchRole(
                    role
                );


                setTimeout(
                    function () {

                        updatePickupNavVisibility();

                        if (
                            role ===
                            "collector"
                        ) {

                            createPickupSection();

                        }

                    },
                    100
                );

            };

    }


    // ============================================================
    // PATCH SHOW SECTION
    // ============================================================

    const oldShowSection =
        window.showSection;


    if (
        typeof oldShowSection ===
        "function"
    ) {

        window.showSection =
            function (sectionId) {

                oldShowSection(
                    sectionId
                );


                if (
                    sectionId ===
                    "pickupRequests"
                ) {

                    createPickupSection();

                    renderRequestList();

                }


                updatePickupNavVisibility();

            };

    }


    // ============================================================
    // INITIALIZATION
    // ============================================================

    setTimeout(
        function () {

            addCollectorPickupNav();

            if (
                getCurrentRole() ===
                "collector"
            ) {

                createPickupSection();

            }


            console.log(
                "✅ Step 5M - Dedicated Collector Pickup Requests ready."
            );

        },
        1000
    );


    // ============================================================
    // AUTO REFRESH
    // ============================================================

    setInterval(
        function () {

            if (
                getCurrentRole() ===
                "collector"
            ) {

                const section =
                    document.getElementById(
                        "pickupRequests"
                    );


                if (
                    section &&
                    section.classList.contains(
                        "active-section"
                    )
                ) {

                    renderRequestList();

                }

            }

        },
        2500
    );

})();

// ============================================================
// STEP 5M FIX
// HOUSEHOLD PICKUP REQUEST → COLLECTOR DASHBOARD BRIDGE
// ============================================================

(function () {

    console.log(
        "🚀 Step 5M FIX - Household → Collector pickup bridge loaded."
    );

    const PICKUP_KEY =
        "kabadiSetuPickupRequests";


    // ============================================================
    // STORAGE HELPERS
    // ============================================================

    function getStoredPickupRequests() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        PICKUP_KEY
                    ) || "[]"
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "Step 5M FIX: Could not read pickup storage.",
                error
            );

            return [];

        }

    }


    function saveStoredPickupRequests(
        requests
    ) {

        localStorage.setItem(
            PICKUP_KEY,
            JSON.stringify(
                requests
            )
        );

    }


    // ============================================================
    // GENERATE FALLBACK REQUEST ID
    // ============================================================

    function generateRequestId() {

        const now =
            new Date();

        const date =
            now.getFullYear().toString() +
            String(
                now.getMonth() + 1
            ).padStart(2, "0") +
            String(
                now.getDate()
            ).padStart(2, "0");


        const random =
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        return (
            "PK-" +
            date +
            "-" +
            random
        );

    }


    // ============================================================
    // ADD HOUSEHOLD REQUEST TO SHARED STORAGE
    // ============================================================

    function saveHouseholdPickupToCollector(
        material,
        weight,
        address,
        requestId
    ) {

        const requests =
            getStoredPickupRequests();


        /*
         * Prevent duplicate requests.
         */

        const alreadyExists =
            requests.some(
                function (request) {

                    return (
                        request &&
                        request.id ===
                        requestId
                    );

                }
            );


        if (alreadyExists) {

            console.log(
                "ℹ️ Pickup request already exists:",
                requestId
            );

            return;

        }


        // --------------------------------------------------------
        // FIND CURRENT PRICE
        // --------------------------------------------------------

        let rate = 0;


        try {

            if (
                typeof currentPrice !==
                "undefined"
            ) {

                rate =
                    Number(
                        currentPrice
                    ) || 0;

            }

        } catch (error) {

            rate = 0;

        }


        // --------------------------------------------------------
        // CREATE SHARED REQUEST
        // --------------------------------------------------------

        const request = {

            id:
                requestId ||
                generateRequestId(),

            customerName:
                "Household User",

            phone:
                "",

            address:
                address ||
                "Address not provided",

            material:
                material ||
                "Recyclable Material",

            estimatedWeight:
                Number(weight) || 0,

            weight:
                Number(weight) || 0,

            estimatedValue:
                rate > 0
                    ? Number(weight) * rate
                    : 0,

            indicativeRate:
                rate,

            status:
                "Pending",

            createdAt:
                new Date().toISOString(),

            acceptedAt:
                null,

            completedAt:
                null

        };


        requests.unshift(
            request
        );


        saveStoredPickupRequests(
            requests
        );


        console.log(
            "✅ HOUSEHOLD REQUEST SAVED FOR COLLECTOR"
        );

        console.log(
            request
        );


        // --------------------------------------------------------
        // NOTIFICATION
        // --------------------------------------------------------

        try {

            if (
                typeof window.addCollectorNotification ===
                "function"
            ) {

                window.addCollectorNotification(
                    "New Pickup Request",
                    `${request.material} pickup requested for ${request.estimatedWeight} kg.`,
                    "pickup"
                );

            }

        } catch (error) {

            console.warn(
                "Notification could not be created.",
                error
            );

        }


        // --------------------------------------------------------
        // REFRESH COLLECTOR UI
        // --------------------------------------------------------

        refreshCollectorPickupUI();

    }


    // ============================================================
    // REFRESH COLLECTOR UI
    // ============================================================

    function refreshCollectorPickupUI() {

        try {

            if (
                typeof window.renderCollectorPickupPage ===
                "function"
            ) {

                window.renderCollectorPickupPage();

            }

        } catch (error) {

            console.warn(
                "Collector pickup page refresh skipped.",
                error
            );

        }


        try {

            if (
                typeof window.renderPickupRequests ===
                "function"
            ) {

                window.renderPickupRequests();

            }

        } catch (error) {

            console.warn(
                "Pickup request card refresh skipped.",
                error
            );

        }

    }


    // ============================================================
    // REPLACE OLD HOUSEHOLD → COLLECTOR FUNCTION
    // ============================================================

    window.addPickupToCollectorQueue =
        function (
            material,
            weight,
            address,
            requestId
        ) {

            console.log(
                "📦 Household → Collector request received."
            );

            saveHouseholdPickupToCollector(
                material,
                weight,
                address,
                requestId
            );

        };


    // ============================================================
    // SYNC OLD IN-MEMORY REQUESTS
    // ============================================================

    /*
     * This is important.
     *
     * If you already created a pickup request before
     * installing this fix, the old request may still
     * exist in the original collectorRequests array.
     *
     * We copy those requests into localStorage once.
     */

    function syncExistingCollectorRequests() {

        try {

            if (
                typeof collectorRequests ===
                "undefined"
            ) {

                console.log(
                    "No old collector request array found."
                );

                return;

            }


            if (
                !Array.isArray(
                    collectorRequests
                )
            ) {

                return;

            }


            const stored =
                getStoredPickupRequests();


            let added =
                0;


            collectorRequests.forEach(
                function (oldRequest) {

                    if (!oldRequest) {
                        return;
                    }


                    const exists =
                        stored.some(
                            function (item) {

                                return (
                                    item.id ===
                                    oldRequest.id
                                );

                            }
                        );


                    if (exists) {
                        return;
                    }


                    stored.push({

                        id:
                            oldRequest.id ||
                            generateRequestId(),

                        customerName:
                            oldRequest.customerName ||
                            "Household User",

                        phone:
                            oldRequest.phone ||
                            "",

                        address:
                            oldRequest.address ||
                            "Address not provided",

                        material:
                            oldRequest.material ||
                            "Recyclable Material",

                        estimatedWeight:
                            Number(
                                oldRequest.weight
                            ) || 0,

                        weight:
                            Number(
                                oldRequest.weight
                            ) || 0,

                        estimatedValue:
                            Number(
                                oldRequest.estimatedValue
                            ) ||
                            (
                                Number(
                                    oldRequest.indicativeRate
                                ) *
                                Number(
                                    oldRequest.weight
                                )
                            ) ||
                            0,

                        indicativeRate:
                            Number(
                                oldRequest.indicativeRate
                            ) || 0,

                        status:
                            oldRequest.status ||
                            "Pending",

                        createdAt:
                            oldRequest.createdAt ||
                            new Date().toISOString(),

                        acceptedAt:
                            oldRequest.acceptedAt ||
                            null,

                        completedAt:
                            oldRequest.completedAt ||
                            null

                    });


                    added++;

                }
            );


            if (added > 0) {

                saveStoredPickupRequests(
                    stored
                );


                console.log(
                    `✅ Synced ${added} old pickup request(s) to collector storage.`
                );

            }

        } catch (error) {

            console.error(
                "Step 5M FIX: Existing request sync failed.",
                error
            );

        }

    }


    // ============================================================
    // PATCH ACCEPT PICKUP
    // ============================================================

    const oldAcceptPickup =
        window.acceptPickup;


    if (
        typeof oldAcceptPickup ===
        "function"
    ) {

        window.acceptPickup =
            function (
                requestId
            ) {

                const requests =
                    getStoredPickupRequests();


                const request =
                    requests.find(
                        function (item) {

                            return (
                                item.id ===
                                requestId
                            );

                        }
                    );


                if (request) {

                    request.status =
                        "Accepted";

                    request.acceptedAt =
                        new Date().toISOString();


                    saveStoredPickupRequests(
                        requests
                    );


                    console.log(
                        "✅ Pickup accepted:",
                        requestId
                    );


                    try {

                        if (
                            typeof window.addCollectorNotification ===
                            "function"
                        ) {

                            window.addCollectorNotification(
                                "Pickup Accepted",
                                `Pickup ${requestId} has been accepted.`,
                                "pickup"
                            );

                        }

                    } catch (error) {}



                    refreshCollectorPickupUI();

                    return;

                }


                /*
                 * If it isn't in localStorage, preserve
                 * the old function.
                 */

                return oldAcceptPickup(
                    requestId
                );

            };

    }


    // ============================================================
    // PATCH COMPLETE PICKUP
    // ============================================================

    const oldCompletePickup =
        window.completePickup;


    if (
        typeof oldCompletePickup ===
        "function"
    ) {

        window.completePickup =
            function (
                requestId,
                actualWeight
            ) {

                const requests =
                    getStoredPickupRequests();


                const request =
                    requests.find(
                        function (item) {

                            return (
                                item.id ===
                                requestId
                            );

                        }
                    );


                if (!request) {

                    return oldCompletePickup(
                        requestId,
                        actualWeight
                    );

                }


                const finalWeight =
                    Number(
                        actualWeight
                    );


                if (
                    !finalWeight ||
                    finalWeight <= 0
                ) {

                    alert(
                        "Please enter a valid physical weight."
                    );

                    return;

                }


                const rate =
                    Number(
                        request.indicativeRate
                    ) || 0;


                const finalValue =
                    rate *
                    finalWeight;


                request.actualWeight =
                    finalWeight;

                request.weight =
                    finalWeight;

                request.finalRate =
                    rate;

                request.finalValue =
                    Number(
                        finalValue.toFixed(2)
                    );

                request.status =
                    "Completed";

                request.completedAt =
                    new Date().toISOString();


                saveStoredPickupRequests(
                    requests
                );


                // ------------------------------------------------
                // ADD TO INVENTORY
                // ------------------------------------------------

                try {

                    if (
                        typeof window.addMaterialToCollectorInventory ===
                        "function"
                    ) {

                        window.addMaterialToCollectorInventory(
                            request.material,
                            finalWeight,
                            rate
                        );

                    }

                } catch (error) {

                    console.warn(
                        "Inventory update failed.",
                        error
                    );

                }


                // ------------------------------------------------
                // NOTIFICATION
                // ------------------------------------------------

                try {

                    if (
                        typeof window.addCollectorNotification ===
                        "function"
                    ) {

                        window.addCollectorNotification(
                            "Pickup Completed",
                            `${request.material} (${finalWeight} kg) was collected and added to inventory.`,
                            "success"
                        );

                    }

                } catch (error) {}



                refreshCollectorPickupUI();


                alert(
                    "Pickup completed successfully.\n\n" +
                    "Material: " +
                    request.material +
                    "\nWeight: " +
                    finalWeight +
                    " kg\nIndicative Value: " +
                    "₹" +
                    finalValue.toLocaleString(
                        "en-IN"
                    )
                );

            };

    }


    // ============================================================
    // INITIAL SYNC
    // ============================================================

    setTimeout(
        function () {

            syncExistingCollectorRequests();

            refreshCollectorPickupUI();

            console.log(
                "========================================"
            );

            console.log(
                "✅ STEP 5M FIX COMPLETE"
            );

            console.log(
                "Household → Collector storage connected."
            );

            console.log(
                "========================================"
            );

        },
        800
    );


    // ============================================================
    // AUTO SYNC
    // ============================================================

    setInterval(
        function () {

            syncExistingCollectorRequests();

        },
        3000
    );


})();

// ============================================================
// FINAL FIX
// HOUSEHOLD PICKUP → COLLECTOR DASHBOARD
// PERSISTENT REQUEST SYNC
// ============================================================

(function () {

    console.log(
        "🚀 Final Pickup Sync Fix loaded."
    );


    const PICKUP_STORAGE_KEY =
        "kabadiSetuPickupRequests";


    // ============================================================
    // GET REQUESTS
    // ============================================================

    function getPickupRequests() {

        try {

            const saved =
                localStorage.getItem(
                    PICKUP_STORAGE_KEY
                );

            if (!saved) {
                return [];
            }

            const data =
                JSON.parse(saved);

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "Pickup storage read error:",
                error
            );

            return [];

        }

    }


    // ============================================================
    // SAVE REQUESTS
    // ============================================================

    function savePickupRequests(
        requests
    ) {

        try {

            localStorage.setItem(
                PICKUP_STORAGE_KEY,
                JSON.stringify(
                    requests
                )
            );

            console.log(
                "💾 Pickup requests saved:",
                requests
            );

        } catch (error) {

            console.error(
                "Pickup storage save error:",
                error
            );

        }

    }


    // ============================================================
    // ADD REQUEST
    // ============================================================

    function createCollectorPickupRequest(
        data
    ) {

        const requests =
            getPickupRequests();


        const requestId =
            data.request_id ||
            (
                "PK-" +
                Date.now()
            );


        // Prevent duplicate request
        const alreadyExists =
            requests.some(
                function (request) {

                    return (
                        request &&
                        request.id ===
                        requestId
                    );

                }
            );


        if (alreadyExists) {

            console.log(
                "ℹ️ Request already stored:",
                requestId
            );

            return;

        }


        const material =
            data.material ||
            "Recyclable Material";


        const weight =
            Number(
                data.weight
            ) || 0;


        const address =
            data.address ||
            "Address not provided";


        let rate = 0;


        try {

            if (
                typeof currentPrice !==
                "undefined"
            ) {

                rate =
                    Number(
                        currentPrice
                    ) || 0;

            }

        } catch (error) {

            rate = 0;

        }


        const request = {

            id:
                requestId,

            customerName:
                "Household User",

            phone:
                "",

            material:
                material,

            category:
                "Household Pickup",

            estimatedWeight:
                weight,

            weight:
                weight,

            address:
                address,

            indicativeRate:
                rate,

            estimatedValue:
                Number(
                    (
                        weight *
                        rate
                    ).toFixed(2)
                ),

            status:
                "Pending",

            createdAt:
                new Date().toISOString(),

            acceptedAt:
                null,

            completedAt:
                null

        };


        requests.unshift(
            request
        );


        savePickupRequests(
            requests
        );


        console.log(
            "========================================"
        );

        console.log(
            "✅ NEW HOUSEHOLD PICKUP SAVED"
        );

        console.log(
            "Request ID:",
            request.id
        );

        console.log(
            "Material:",
            request.material
        );

        console.log(
            "Weight:",
            request.weight
        );

        console.log(
            "Address:",
            request.address
        );

        console.log(
            "========================================"
        );


        // Refresh collector page
        refreshCollectorPage();

    }


    // ============================================================
    // PATCH FETCH
    //
    // This is the important part.
    //
    // Whenever /pickup succeeds, we automatically save
    // the request to collector storage.
    // ============================================================

    const originalFetch =
        window.fetch;


    window.fetch =
        async function (
            input,
            init
        ) {

            const response =
                await originalFetch(
                    input,
                    init
                );


            try {

                let url = "";


                if (
                    typeof input ===
                    "string"
                ) {

                    url = input;

                } else if (
                    input &&
                    input.url
                ) {

                    url = input.url;

                }


                // Only intercept household pickup API
                if (
                    url.includes(
                        "/pickup"
                    )
                ) {

                    // Clone because response.json()
                    // can only normally be read once.
                    const clone =
                        response.clone();


                    const result =
                        await clone.json();


                    if (
                        response.ok &&
                        result &&
                        result.success
                    ) {

                        let body = {};


                        try {

                            if (
                                init &&
                                init.body
                            ) {

                                body =
                                    JSON.parse(
                                        init.body
                                    );

                            }

                        } catch (error) {

                            console.warn(
                                "Could not parse pickup request body."
                            );

                        }


                        createCollectorPickupRequest({

                            request_id:
                                result.request_id,

                            material:
                                result.material ||
                                body.material,

                            weight:
                                result.weight ||
                                body.weight,

                            address:
                                body.address

                        });

                    }

                }

            } catch (error) {

                console.warn(
                    "Pickup sync processing error:",
                    error
                );

            }


            return response;

        };


    // ============================================================
    // REFRESH COLLECTOR PAGE
    // ============================================================

    function refreshCollectorPage() {

        try {

            if (
                typeof window.renderCollectorPickupPage ===
                "function"
            ) {

                window.renderCollectorPickupPage();

            }

        } catch (error) {

            console.warn(
                "Collector pickup page refresh skipped."
            );

        }

    }


    // ============================================================
    // PATCH COLLECTOR ACCEPT
    // ============================================================

    const oldAccept =
        window.acceptPickup;


    window.acceptPickup =
        function (
            requestId
        ) {

            const requests =
                getPickupRequests();


            const request =
                requests.find(
                    function (item) {

                        return (
                            item.id ===
                            requestId
                        );

                    }
                );


            if (request) {

                request.status =
                    "Accepted";


                request.acceptedAt =
                    new Date().toISOString();


                savePickupRequests(
                    requests
                );


                console.log(
                    "✅ Collector accepted pickup:",
                    requestId
                );


                refreshCollectorPage();

                return;

            }


            // Fallback to existing function
            if (
                typeof oldAccept ===
                "function"
            ) {

                return oldAccept(
                    requestId
                );

            }

        };


    // ============================================================
    // PATCH COMPLETE PICKUP
    // ============================================================

    const oldComplete =
        window.completePickup;


    window.completePickup =
        function (
            requestId,
            actualWeight
        ) {

            const requests =
                getPickupRequests();


            const request =
                requests.find(
                    function (item) {

                        return (
                            item.id ===
                            requestId
                        );

                    }
                );


            if (!request) {

                if (
                    typeof oldComplete ===
                    "function"
                ) {

                    return oldComplete(
                        requestId,
                        actualWeight
                    );

                }

                return;

            }


            const finalWeight =
                Number(
                    actualWeight
                );


            if (
                !finalWeight ||
                finalWeight <= 0
            ) {

                alert(
                    "Please enter a valid physical weight."
                );

                return;

            }


            const rate =
                Number(
                    request.indicativeRate
                ) || 0;


            request.actualWeight =
                finalWeight;


            request.weight =
                finalWeight;


            request.finalValue =
                Number(
                    (
                        finalWeight *
                        rate
                    ).toFixed(2)
                );


            request.status =
                "Completed";


            request.completedAt =
                new Date().toISOString();


            savePickupRequests(
                requests
            );


            console.log(
                "✅ Pickup completed:",
                requestId
            );


            // ====================================================
            // ADD MATERIAL TO INVENTORY
            // ====================================================

            try {

                if (
                    typeof window.addMaterialToCollectorInventory ===
                    "function"
                ) {

                    window.addMaterialToCollectorInventory(
                        request.material,
                        finalWeight,
                        rate
                    );

                }

            } catch (error) {

                console.warn(
                    "Inventory update skipped:",
                    error
                );

            }


            refreshCollectorPage();


            alert(
                "Pickup completed successfully!\n\n" +
                "Material: " +
                request.material +
                "\n" +
                "Actual Weight: " +
                finalWeight +
                " kg\n" +
                "Indicative Value: ₹" +
                request.finalValue.toLocaleString(
                    "en-IN"
                )
            );

        };


    // ============================================================
    // SYNC OLD IN-MEMORY REQUESTS
    // ============================================================

    function syncOldRequests() {

        try {

            if (
                typeof collectorRequests ===
                "undefined"
            ) {

                return;

            }


            if (
                !Array.isArray(
                    collectorRequests
                )
            ) {

                return;

            }


            const stored =
                getPickupRequests();


            let added =
                0;


            collectorRequests.forEach(
                function (
                    oldRequest
                ) {

                    if (!oldRequest) {
                        return;
                    }


                    const exists =
                        stored.some(
                            function (
                                savedRequest
                            ) {

                                return (
                                    savedRequest.id ===
                                    oldRequest.id
                                );

                            }
                        );


                    if (exists) {
                        return;
                    }


                    stored.push({

                        id:
                            oldRequest.id ||
                            (
                                "PK-" +
                                Date.now() +
                                "-" +
                                Math.random()
                                    .toString(36)
                                    .slice(2, 7)
                            ),

                        customerName:
                            "Household User",

                        phone:
                            "",

                        material:
                            oldRequest.material ||
                            "Recyclable Material",

                        category:
                            oldRequest.category ||
                            "Household Pickup",

                        estimatedWeight:
                            Number(
                                oldRequest.weight
                            ) || 0,

                        weight:
                            Number(
                                oldRequest.weight
                            ) || 0,

                        address:
                            oldRequest.address ||
                            "Address not provided",

                        indicativeRate:
                            Number(
                                oldRequest.indicativeRate
                            ) || 0,

                        estimatedValue:
                            (
                                Number(
                                    oldRequest.weight
                                ) || 0
                            ) *
                            (
                                Number(
                                    oldRequest.indicativeRate
                                ) || 0
                            ),

                        status:
                            oldRequest.status ||
                            "Pending",

                        createdAt:
                            oldRequest.createdAt ||
                            new Date().toISOString(),

                        acceptedAt:
                            oldRequest.acceptedAt ||
                            null,

                        completedAt:
                            oldRequest.completedAt ||
                            null

                    });


                    added++;

                }
            );


            if (
                added > 0
            ) {

                savePickupRequests(
                    stored
                );


                console.log(
                    "✅ Old collector requests synced:",
                    added
                );

            }

        } catch (error) {

            console.error(
                "Old request sync error:",
                error
            );

        }

    }


    // ============================================================
    // INITIALIZE
    // ============================================================

    setTimeout(
        function () {

            syncOldRequests();


            console.log(
                "📦 Current stored pickup requests:",
                getPickupRequests()
            );


            refreshCollectorPage();


            console.log(
                "========================================"
            );

            console.log(
                "✅ FINAL PICKUP SYNC ACTIVE"
            );

            console.log(
                "Household → Backend → localStorage → Collector"
            );

            console.log(
                "========================================"
            );

        },
        1000
    );


})();