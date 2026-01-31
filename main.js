// main.js
// منطق صفحة إنشاء التهنئة

document.addEventListener("DOMContentLoaded", function() {
  const greetingForm = document.getElementById("greetingForm");
  const recipientName = document.getElementById("recipientName");
  const recipientType = document.getElementById("recipientType");
  const defaultGreetings = document.getElementById("defaultGreetings");
  const defaultGreetingSelect = document.getElementById("defaultGreetingSelect");
  const customGreetingDiv = document.getElementById("customGreetingDiv");
  const customGreeting = document.getElementById("customGreeting");
  const resultDiv = document.getElementById("resultDiv");
  const resultLink = document.getElementById("resultLink");
  const copyResultBtn = document.getElementById("copyResultBtn");
  const showGreetingBtn = document.getElementById("showGreetingBtn");

  // إظهار/إخفاء حقل التهنئة المخصصة
  greetingForm.greetingType.forEach(radio => {
    radio.addEventListener("change", function() {
      if (this.value === "custom") {
        customGreetingDiv.style.display = "flex";
        defaultGreetings.style.display = "none";
      } else {
        customGreetingDiv.style.display = "none";
        defaultGreetings.style.display = "flex";
      }
    });
  });

  greetingForm.addEventListener("submit", function(e) {
    e.preventDefault();
    // بناء الرابط
    const name = recipientName.value.trim();
    const type = recipientType.value;
    let greeting = "";
    let isCustom = greetingForm.greetingType.value === "custom";
    if (isCustom) {
      greeting = customGreeting.value.trim() || "رمضان كريم";
    } else {
      // جمل افتراضية حسب النوع
      let greetings = {
        male: [
          `كل سنة وأنت طيب يا ${name || "..."} 🌙✨`,
          `أسأل الله أن يبلغك رمضان وأنت في أتم الصحة والعافية يا ${name || "..."} 🤲`,
          `رمضان مبارك عليك وعلى أحبابك يا ${name || "..."} 💛`
        ],
        female: [
          `كل سنة وأنتِ طيبة يا ${name || "..."} 🌙✨`,
          `أسأل الله أن يبلغكِ رمضان وأنتِ في أتم الصحة والعافية يا ${name || "..."} 🤲`,
          `رمضان مبارك عليكِ وعلى أحبابكِ يا ${name || "..."} 💛`
        ],
        all: [
          "كل سنة وأنتم طيبين جميعًا، رمضان كريم! 🌙✨",
          "أسأل الله أن يبلغكم رمضان وأنتم في أتم الصحة والعافية 🤲",
          "رمضان مبارك عليكم جميعًا 💛"
        ]
      };
      let idx = defaultGreetingSelect.selectedIndex;
      greeting = greetings[type][idx] || greetings.male[0];
    }
    // بناء الرابط
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    params.set("type", type);
    params.set("greeting", encodeURIComponent(greeting));
    // دعم المسارات الفرعية مثل GitHub Pages
    let base = location.origin + location.pathname.replace(/\/index.html$/, "/");
    if (!base.endsWith("/")) base += "/";
    const url = `${base}greeting.html?${params.toString()}`;
    resultLink.value = url;
    resultDiv.style.display = "flex";
  });

  copyResultBtn.addEventListener("click", function() {
    resultLink.select();
    document.execCommand("copy");
    copyResultBtn.textContent = "تم النسخ!";
    setTimeout(()=>copyResultBtn.textContent = "نسخ الرابط", 1200);
  });

  showGreetingBtn.addEventListener("click", function() {
    window.location.href = resultLink.value;
  });
});
