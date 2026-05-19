window.addEventListener("load", () => {

  const splash =
    document.getElementById("splash-screen");

  if (!splash) return;

  setTimeout(() => {

    splash.classList.add("hide");

    setTimeout(() => {
      splash.remove();
    }, 700);

  }, 1300);

});

// =========================
// SUPABASE
// =========================

const supabaseUrl = "https://cjrpjekmqrckozrbtwps.supabase.co";

const supabaseKey =
  "sb_publishable_nR5kvC32lYVX0OflJM8sUA_tBaqRy1b";

const sb = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);



// =========================
// DOM LOADED
// =========================

document.addEventListener("DOMContentLoaded", () => {

  // ALL YOUR OTHER CODE HERE
// =========================
// CONTACT FORM (WEB3FORMS)
// =========================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

  contactForm.addEventListener("submit", async function(e) {

    e.preventDefault();

    const btn = document.getElementById("submitBtn");

    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Sending...";

    try {

      const formData = new FormData(contactForm);

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      if (result.success) {

        btn.textContent = "Message Sent ✔";

        contactForm.reset();

      } else {

        console.error(result);

        btn.textContent = "Failed ❌";

      }

    } catch (error) {

      console.error(error);

      btn.textContent = "Network Error ❌";

    }

    setTimeout(() => {

      btn.disabled = false;

      btn.textContent = originalText;

    }, 3000);

  });

}

  // =========================
  // CHAPTER-STYLE SCROLL ANIMATION
  // =========================

  const pageSections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        // delay based on section order
        const index = Array.from(pageSections).indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 120); // 👈 stagger effect

      }

    });

  }, {
    threshold: 0.15
  });

  pageSections.forEach(section => {
    section.classList.add("animate");
    observer.observe(section);
  });



  // =========================
  // AUTO YEAR UPDATE
  // =========================

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
  
  // =========================
// SCROLL PROGRESS BAR
// =========================

const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {

  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;

  const progress = (scrollTop / docHeight) * 100;

  if (progressBar) {
    progressBar.style.width = progress + "%";
  }

});


// =========================
// ACTIVE NAV HIGHLIGHT
// =========================

const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;

    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });

});

// =========================
// HERO PARALLAX (SUBTLE)
// =========================

const heroImage = document.querySelector(".hero-image img");

window.addEventListener("scroll", () => {

  if (!heroImage) return;

  const offset = window.scrollY * 0.05;

  heroImage.style.transform = `translateY(${offset}px)`;

});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = this.getAttribute("href");

    // skip if href is just "#" with nothing after
    if (target === "#") return;

    e.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  });
});

  
  
  
// =========================
// MODAL + SUPABASE REGISTRATION
// =========================

const modal = document.getElementById("registerModal");
const closeBtn = document.querySelector(".close");
const levelSelect = document.getElementById("courseLevel");
const levelText = document.getElementById("selectedLevelText");


// OPEN MODAL FROM PROGRAM CARD
document.querySelectorAll(".enroll-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const level = btn.dataset.level;
    const title = btn.dataset.title;
    const desc = btn.dataset.desc;
    const price = btn.dataset.price;
    

    // update modal UI
    document.querySelector(".modal-header h2").textContent = title;
    levelText.innerHTML = `You selected: <strong>${level}</strong>`;

    document.querySelector(".modal-preview ul").innerHTML = `
      <li>${desc || "Structured Arabic learning path"}</li>
      <li>Guided video lessons</li>
      <li>Practice exercises & support</li>
      
    `;

    levelSelect.value = level;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
});

// CLOSE MODAL
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// =========================
// REGISTER FORM
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = registerForm.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Registering...";

      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("registerEmail").value.trim().toLowerCase();
      const whatsapp = document.getElementById("whatsapp").value;
      const gender = document.getElementById("gender").value;
      const age = document.getElementById("age").value;
      const country = document.getElementById("country").value;
      const level = document.getElementById("courseLevel").value;

      // CHECK EXISTING STUDENT
      const { data: existingStudent, error: checkError } = await sb
        .from("students")
        .select("email, matric_number")
        .eq("email", email)
        .maybeSingle();

      if (checkError) throw checkError;

      const successModal = document.getElementById("successModal");
      const studentIdText = document.getElementById("studentIdText");
      const successTitle = document.getElementById("successTitle");
      const successMessage = document.getElementById("successMessage");

      // IF EXISTS
      if (existingStudent) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        successTitle.textContent = "Already Registered ⚠️";
        successMessage.textContent = "We found your existing record.";
        studentIdText.textContent = existingStudent.matric_number;

        successModal.classList.add("show");

        document.getElementById("copyIdBtn").onclick = () => {
          navigator.clipboard.writeText(existingStudent.matric_number);
        };

        document.getElementById("closeSuccess").onclick = () => {
          successModal.classList.remove("show");
        };

        return;
      }

      // INSERT NEW STUDENT
      const { data, error } = await sb
  .from("students")
  .insert([
    {
      fullname: fullName,
      email: email,
      whatsapp: whatsapp,
      gender: gender,
      age: age,
      country: country,
      level_arabic: level
    }
  ])
  .select("matric_number")
  .maybeSingle();

if (error) {

  if (error.code === "23505") {
    alert("User already registered");
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    return;
  }

  throw error;
}

if (!data) {
  alert("Something went wrong. No data returned.");
  return;
}

        await fetch("https://api.web3forms.com/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    access_key: "73556940-2533-43e1-8458-aab6b0e894dc",

    subject: "New Student Registration 🎓",

    message: `
A new student just registered:

Name: ${fullName}
Email: ${email}
WhatsApp: ${whatsapp}
Country: ${country}
Level: ${level}
Matric: ${data.matric_number}
    `
  })
});

      if (error) {

  // duplicate email
  if (error.code === "23505") {

    alert("This email is already registered.");
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    return;
  }

  throw error;
}
      // SUCCESS UI
      successTitle.textContent = "Registration Successful 🎉";
      successMessage.textContent = "Welcome to Al-Bayan!";
      studentIdText.textContent = data.matric_number;

      successModal.classList.add("show");

      document.getElementById("copyIdBtn").onclick = () => {
        navigator.clipboard.writeText(data.matric_number);
      };

      document.getElementById("closeSuccess").onclick = () => {
        successModal.classList.remove("show");
      };

// SAVE COUNTRY (existing system - keep this)
localStorage.setItem("studentCountry", country);

// NEW SYSTEM (for payment autofill upgrade)
localStorage.setItem("alBayanUser", JSON.stringify({
  matric_number: data.matric_number,
  fullname: fullName,
  email: email,
  country: country,
  level_arabic: level,
  plan_type: level === "Advanced" ? "private" : "general"
}));

setTimeout(() => {
  window.location.href = "payment.html";
}, 3000);

    } catch (err) {
      console.error(err);

      alert("Something went wrong. Please try again.");

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });    
}    
});  

// =========================
// PAYMENT PAGE LOGIC
// =========================

document.addEventListener("DOMContentLoaded", async () => {

  const paymentForm = document.getElementById("paymentForm");

  if (!paymentForm) return;

  // =========================
  // LOAD USER DATA
  // =========================

  const savedUser =
    JSON.parse(localStorage.getItem("alBayanUser"));

    const planWrapper =
  document.getElementById("planTypeWrapper");

const planField =
  document.getElementById("plan_type");

const africanCountries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "Uganda",
  "South Africa"
];

const isAfrican =
  africanCountries.includes(savedUser.country);

if (!isAfrican) {

  // hide selector completely
  planWrapper.style.display = "none";

  // force international plan
  planField.value = "international";

}

  if (!savedUser) return;

  // autofill form
  document.getElementById("matric_number").value =
    savedUser.matric_number || "";

  document.getElementById("payer_name").value =
    savedUser.fullname || "";

  document.getElementById("payer_email").value =
    savedUser.email || "";

  document.getElementById("country").value =
    savedUser.country || "";

  document.getElementById("plan_type").value =
    savedUser.plan_type || "";

  // =========================
  // SUBMIT PAYMENT
  // =========================

  paymentForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const submitBtn =
      paymentForm.querySelector("button");

    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Uploading...";

    try {

      const matric_number =
        document.getElementById("matric_number").value;

      const payer_name =
        document.getElementById("payer_name").value;

      const payer_email =
        document.getElementById("payer_email").value;

      const country =
        document.getElementById("country").value;

      const plan_type =
        document.getElementById("plan_type").value;

      const level_arabic =
        savedUser.level_arabic;

      const amount =
        document.getElementById("amount").value;
       
      const currency =
        document.getElementById("currency").value;
        
      const payment_method =
    document.getElementById("payment_method")?.value;
    
      const month = new Date().toLocaleString("default", {
  month: "long",
  year: "numeric"
});
      const receiptFile =
        document.getElementById("receipt").files[0];

      // =========================
      // UPLOAD RECEIPT
      // =========================

      const fileName =
        `${Date.now()}-${receiptFile.name}`;

      const { error: uploadError } = await sb
        .storage
        .from("payment_receipts")
        .upload(fileName, receiptFile);

      if (uploadError) throw uploadError;

      // get public url
      const { data: publicUrlData } = sb
        .storage
        .from("payment_receipts")
        .getPublicUrl(fileName);

      const receipt_url =
        publicUrlData.publicUrl;

      // =========================
      // INSERT PAYMENT
      // =========================

      const { error: paymentError } = await sb
        .from("payments")
        .insert([
          {
            matric_number,
            payer_name,
            payer_email,
            country,
            level_arabic,
            plan_type,
            month,
            amount,
            currency,
            payment_method,            
            receipt_url,
            verification_status: "pending",
            status: "pending"
          }
        ]);

await fetch("https://api.web3forms.com/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    access_key: "73556940-2533-43e1-8458-aab6b0e894dc",

    subject: "New Payment Submitted 💰",

    message: `
Payment received:

Name: ${payer_name}
Email: ${payer_email}
Matric: ${matric_number}
Amount: ${amount} ${currency}
Plan: ${plan_type}
Country: ${country}
Month: ${month}
Payment Method: ${payment_method}
Receipt: ${receipt_url}
    `
  })
});

      if (paymentError) throw paymentError;

      const successBox = document.createElement("div");

successBox.className = "payment-success-modal";

successBox.innerHTML = `
  <div class="payment-success-content">

    <div class="success-icon">✔</div>

    <h2>Payment Submitted</h2>

    <p>
      Your payment proof was uploaded successfully.
      Our team will verify it shortly.
    </p>

    <button class="success-close-btn">
      Continue
    </button>

  </div>
`;

document.body.appendChild(successBox);

setTimeout(() => {
  successBox.classList.add("show");
}, 100);

successBox
  .querySelector(".success-close-btn")
  .addEventListener("click", () => {

    successBox.classList.remove("show");

    setTimeout(() => {
      successBox.remove();
    }, 300);

  });

      submitBtn.textContent = "Submitted ✔";

setTimeout(() => {

  paymentForm.reset();

  // RESTORE AUTO FILLED VALUES
  document.getElementById("matric_number").value = matric_number;
  document.getElementById("payer_name").value = payer_name;
  document.getElementById("payer_email").value = payer_email;
  document.getElementById("country").value = country;

}, 3800);

    } catch (err) {

      console.error(err);

      alert("Failed to submit payment.");

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

    }

  });

});
