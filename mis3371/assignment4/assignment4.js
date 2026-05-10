/* Author: Maxwell Sleeper
   File: assignment4.js
   Version: FINAL (Assignment 4 Complete)
*/

/* ── COOKIE UTILITIES ───────────────────────────── */

function setCookie(name, value, hours) {
    let d = new Date();
    d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
    let cookies = document.cookie.split(";");
    for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(name + "=") === 0) {
            return c.substring(name.length + 1);
        }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/* ── USER SESSION ──────────────────────────────── */

const STORAGE_KEY = "patient_form_data";

function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

function resetUser() {
    deleteCookie("firstName");
    clearLocalStorage();
    document.getElementById("regForm").reset();
    location.reload();
}

function handleRememberMe() {
    const remember = document.getElementById("rememberMe");
    if (!remember) return;

    if (!remember.checked) {
        deleteCookie("firstName");
        clearLocalStorage();
    }
}

function saveUserIdentity() {
    const remember = document.getElementById("rememberMe");
    if (!remember || !remember.checked) return;

    const fname = document.getElementById("fname").value;
    if (fname) setCookie("firstName", fname, 48);
}

/* ── LOCAL STORAGE ─────────────────────────────── */

function saveToLocalStorage() {
    const formData = {};

    document.querySelectorAll("#regForm input, #regForm select, #regForm textarea")
        .forEach(el => {
            if (el.type === "password") return;
            if (el.id === "ssn") return;

            const key = el.name || el.id;

            if (el.type === "checkbox") {
                formData[key] = el.checked;
            } else if (el.type === "radio") {
                if (el.checked) formData[key] = el.value;
            } else {
                formData[key] = el.value;
            }
        });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;

    const formData = JSON.parse(data);

    document.querySelectorAll("#regForm input, #regForm select, #regForm textarea")
        .forEach(el => {
            const key = el.name || el.id;
            if (!(key in formData)) return;

            if (el.type === "checkbox") {
                el.checked = formData[key];
            } else if (el.type === "radio") {
                el.checked = (el.value === formData[key]);
            } else {
                el.value = formData[key];
            }
        });
}

function initUserSession() {
    let fname = getCookie("firstName");

    if (fname) {
        document.getElementById("fname").value = fname;

        let confirmUser = confirm("Welcome back " + fname + ". Is this you?");
        if (confirmUser) {
            loadFromLocalStorage();
        } else {
            resetUser();
        }
    }
}

/* ── HEADER GREETING ───────────────────── */

function renderHeaderGreeting() {
    const fname = getCookie("firstName");
    const header = document.getElementById("header");

    let old = document.getElementById("greetingBox");
    if (old) old.remove();

    let box = document.createElement("div");
    box.id = "greetingBox";

    if (fname) {
        box.innerHTML = `
            <h2>Hello ${fname}</h2>
            <label>
                <input type="checkbox" onclick="resetUser()">
                Not ${fname}? Click HERE to start as a NEW USER
            </label>
        `;
    } else {
        box.innerHTML = `<h2>Welcome New User</h2>`;
    }

    header.prepend(box);
}

/* ── VALIDATION FUNCTIONS ───────────────────────── */

function validateName() {
    let f = fname.value;
    let l = lname.value;
    let msg = "";

    if (!/^[A-Za-z'\-]{1,30}$/.test(f)) {
        msg = "Invalid first name.";
    } else if (!/^[A-Za-z'\-]{1,30}$/.test(l)) {
        msg = "Invalid last name.";
    }

    name_text.innerHTML = msg;

    if (!msg && f) setCookie("firstName", f, 48);
}

function validateMI() {
    let v = mi.value;
    mi_text.innerHTML = (v && !/^[A-Za-z]$/.test(v)) ? "1 letter only." : "";
}

function validateDOB() {
    let v = dob.value;
    let msg = "";

    if (!v) msg = "Required.";
    else {
        let d = new Date(v);
        let today = new Date();
        let min = new Date();
        min.setFullYear(today.getFullYear() - 120);

        if (d > today) msg = "Future date not allowed.";
        else if (d < min) msg = "Too old.";
    }

    dob_text.innerHTML = msg;
}

function formatSSN(field) {
    let v = field.value.replace(/\D/g, '');
    if (v.length > 5)
        field.value = v.slice(0,3)+"-"+v.slice(3,5)+"-"+v.slice(5,9);
    else if (v.length > 3)
        field.value = v.slice(0,3)+"-"+v.slice(3);
}

function validateSSN() {
    ssn_text.innerHTML =
        (!/^\d{3}-\d{2}-\d{4}$/.test(ssn.value))
            ? "Invalid SSN format."
            : "";
}

function validateEmail() {
    email_text.innerHTML =
        (!/^\S+@\S+\.\S+$/.test(email.value))
            ? "Invalid email."
            : "";
}

function validatePhone() {
    phone_text.innerHTML =
        (!/^\d{3}-\d{3}-\d{4}$/.test(phone.value))
            ? "Invalid phone."
            : "";
}

function validateAddress() {
    addr1_text.innerHTML =
        (addr1.value.length < 2) ? "Too short." : "";
}

function validateAddress2() {
    addr2_text.innerHTML =
        (addr2.value && addr2.value.length < 2) ? "Too short." : "";
}

function validateCity() {
    city_text.innerHTML =
        (!/^[A-Za-z' \-]{2,30}$/.test(city.value))
            ? "Invalid city."
            : "";
}

function validateState() {
    state_text.innerHTML = (!state.value) ? "Select state." : "";
}

function validateZip() {
    zip_text.innerHTML =
        (!/^\d{5}$/.test(zip.value)) ? "Invalid zip." : "";
}

function validateRadios() {
    ["gender","vax","ins"].forEach(g=>{
        document.getElementById(g+"_text").innerHTML =
            (!document.querySelector(`input[name="${g}"]:checked`))
                ? "Required." : "";
    });
}

function validateSymptoms() {
    symptoms_text.innerHTML =
        (symptoms.value && symptoms.value.length < 5)
            ? "Too short." : "";
}

function checkUserID() {
    userid_text.innerHTML =
        (!/^[A-Za-z][A-Za-z0-9_\-]{4,19}$/.test(userid.value))
            ? "Invalid ID." : "";
}

function checkPasswords() {
    let p1 = pw1.value;
    let p2 = pw2.value;

    pw1_text.innerHTML =
        (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(p1))
            ? "Weak password." : "";

    pw2_text.innerHTML =
        (p1 !== p2) ? "No match." : "";
}

/* ── FORM VALIDATION ───────────────────────── */

function validateForm() {
    validateName();
    validateMI();
    validateDOB();
    validateSSN();
    validateEmail();
    validatePhone();
    validateAddress();
    validateAddress2();
    validateCity();
    validateState();
    validateZip();
    validateRadios();
    validateSymptoms();
    checkUserID();
    checkPasswords();

    let hasError = false;
    document.querySelectorAll(".errmsg").forEach(e=>{
        if (e.innerHTML !== "") hasError = true;
    });

    if (!hasError) {
        submitBtn.style.display = "inline";
        saveUserIdentity();
        alert("Form valid!");
    } else {
        alert("Fix errors.");
    }
}

/* ── REVIEW TABLE ───────────────────────── */

function reviewData() {
    const body = reviewBody;
    body.innerHTML = "";

    document.querySelectorAll("#regForm input, #regForm select, #regForm textarea")
        .forEach(el => {
            if (!el.id || el.type === "password") return;

            let val = "";

            if (el.type === "checkbox") val = el.checked ? "Yes" : "No";
            else if (el.type === "radio") {
                if (!el.checked) return;
                val = el.value;
            } else val = el.value;

            body.innerHTML += `<tr><td>${el.id}</td><td>${val}</td></tr>`;
        });

    reviewSection.style.display = "block";
}

function removeReview() {
    reviewSection.style.display = "none";
}

/* ── FETCH API ───────────────────────── */

async function loadStates() {
    try {
        const res = await fetch("states.json");
        const states = await res.json();

        states.forEach(s => {
            let opt = document.createElement("option");
            opt.value = s.code;
            opt.textContent = s.name;
            state.appendChild(opt);
        });
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

/* ── INIT ───────────────────────── */

window.onload = function () {
    renderHeaderGreeting();
    initUserSession();
    loadStates();
};

document.addEventListener("input", function (e) {
    if (e.target.closest("#regForm")) {
        saveToLocalStorage();
    }
});
