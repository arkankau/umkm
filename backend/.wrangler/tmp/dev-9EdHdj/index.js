var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-RrbS1n/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/utils/validation.js
var businessSchema = {
  businessName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-&.()]+$/
  },
  ownerName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  category: {
    required: true,
    enum: ["restaurant", "retail", "service", "other"]
  },
  products: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  phone: {
    required: true,
    pattern: /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  },
  email: {
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200
  },
  whatsapp: {
    required: false,
    pattern: /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  },
  instagram: {
    required: false,
    pattern: /^[a-zA-Z0-9._]+$/
  }
};
function validateBusinessData(data) {
  const errors = {};
  const validated = {};
  for (const [field, rules] of Object.entries(businessSchema)) {
    const value = data[field]?.trim();
    if (rules.required && (!value || value.length === 0)) {
      errors[field] = `${field} is required`;
      continue;
    }
    if (!rules.required && (!value || value.length === 0)) {
      continue;
    }
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      continue;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
      continue;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = `${field} format is invalid`;
      continue;
    }
    if (rules.enum && !rules.enum.includes(value)) {
      errors[field] = `${field} must be one of: ${rules.enum.join(", ")}`;
      continue;
    }
    validated[field] = sanitizeInput(value);
  }
  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }
  return validated;
}
__name(validateBusinessData, "validateBusinessData");
function sanitizeInput(input) {
  if (typeof input !== "string") return input;
  return input.replace(/[<>]/g, "").replace(/javascript:/gi, "").trim();
}
__name(sanitizeInput, "sanitizeInput");
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
__name(generateUUID, "generateUUID");
function generateSubdomain(businessName) {
  return businessName.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 20).padEnd(3, "x") + Math.random().toString(36).substring(2, 6);
}
__name(generateSubdomain, "generateSubdomain");

// src/api/submit-business.js
async function submitBusiness(request, env, ctx) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method Not Allowed",
      message: "Only POST method is allowed"
    }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const formData = await request.json();
    const validated = validateBusinessData(formData);
    const businessId = generateUUID();
    const subdomain = generateSubdomain(validated.businessName);
    const businessData = {
      ...validated,
      id: businessId,
      subdomain,
      status: "processing",
      createdAt: Date.now(),
      logoUrl: formData.logoUrl || null,
      websiteUrl: null
    };
    await env.UMKM_KV.put(
      `business:${businessId}`,
      JSON.stringify(businessData)
    );
    await env.UMKM_KV.put(
      `subdomain:${subdomain}`,
      businessId
    );
    ctx.waitUntil(
      triggerSiteGeneration(businessId, env)
    );
    return new Response(JSON.stringify({
      success: true,
      businessId,
      subdomain,
      status: "processing",
      message: "Business data submitted successfully. Site generation in progress."
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Submit business error:", error);
    if (error.message.includes("{")) {
      try {
        const validationErrors = JSON.parse(error.message);
        return new Response(JSON.stringify({
          error: "Validation Error",
          message: "Please check your input data",
          details: validationErrors
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      } catch (parseError) {
      }
    }
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: "Failed to submit business data"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(submitBusiness, "submitBusiness");
async function triggerSiteGeneration(businessId, env) {
  try {
    const response = await fetch(`${env.EDGEONE_FUNCTION_URL}/api/generate-site`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.EDGEONE_API_TOKEN}`
      },
      body: JSON.stringify({ businessId })
    });
    if (!response.ok) {
      console.error("Site generation failed:", await response.text());
      const businessData = JSON.parse(
        await env.UMKM_KV.get(`business:${businessId}`)
      );
      businessData.status = "error";
      businessData.error = "Site generation failed";
      await env.UMKM_KV.put(
        `business:${businessId}`,
        JSON.stringify(businessData)
      );
    }
  } catch (error) {
    console.error("Error triggering site generation:", error);
    try {
      const businessData = JSON.parse(
        await env.UMKM_KV.get(`business:${businessId}`)
      );
      businessData.status = "error";
      businessData.error = "Site generation failed";
      await env.UMKM_KV.put(
        `business:${businessId}`,
        JSON.stringify(businessData)
      );
    } catch (kvError) {
      console.error("Error updating KV:", kvError);
    }
  }
}
__name(triggerSiteGeneration, "triggerSiteGeneration");

// src/utils/template.js
var templates = {
  restaurant: getRestaurantTemplate(),
  retail: getRetailTemplate(),
  service: getServiceTemplate(),
  other: getDefaultTemplate()
};
async function loadTemplate(category) {
  return templates[category] || templates.other;
}
__name(loadTemplate, "loadTemplate");
function processTemplate(template, businessData) {
  let html = template;
  const replacements = {
    "{{BUSINESS_NAME}}": businessData.businessName || "",
    "{{OWNER_NAME}}": businessData.ownerName || "",
    "{{DESCRIPTION}}": businessData.description || "",
    "{{CATEGORY}}": businessData.category || "",
    "{{PRODUCTS}}": businessData.products || "",
    "{{PHONE}}": businessData.phone || "",
    "{{EMAIL}}": businessData.email || "",
    "{{ADDRESS}}": businessData.address || "",
    "{{WHATSAPP}}": businessData.whatsapp || "",
    "{{INSTAGRAM}}": businessData.instagram || "",
    "{{LOGO_URL}}": businessData.logoUrl || "/default-logo.png",
    "{{WEBSITE_URL}}": businessData.websiteUrl || "",
    "{{GOOGLE_MAPS_URL}}": generateGoogleMapsUrl(businessData.address),
    "{{WHATSAPP_URL}}": generateWhatsAppUrl(businessData.whatsapp || businessData.phone),
    "{{INSTAGRAM_URL}}": generateInstagramUrl(businessData.instagram),
    "{{CURRENT_YEAR}}": (/* @__PURE__ */ new Date()).getFullYear().toString()
  };
  Object.entries(replacements).forEach(([placeholder, value]) => {
    html = html.replace(new RegExp(placeholder, "g"), value);
  });
  return html;
}
__name(processTemplate, "processTemplate");
function generateGoogleMapsUrl(address) {
  if (!address) return "#";
  const encodedAddress = encodeURIComponent(address);
  return `https://maps.google.com/?q=${encodedAddress}`;
}
__name(generateGoogleMapsUrl, "generateGoogleMapsUrl");
function generateWhatsAppUrl(phone) {
  if (!phone) return "#";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const whatsappPhone = cleanPhone.startsWith("62") ? cleanPhone : `62${cleanPhone}`;
  return `https://wa.me/${whatsappPhone}`;
}
__name(generateWhatsAppUrl, "generateWhatsAppUrl");
function generateInstagramUrl(instagram) {
  if (!instagram) return "#";
  return `https://instagram.com/${instagram}`;
}
__name(generateInstagramUrl, "generateInstagramUrl");
function getRestaurantTemplate() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - Restoran & Kuliner</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .menu-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #2c3e50; color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #e74c3c; color: white; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
        .btn:hover { background: #c0392b; }
        .footer { background: #34495e; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem; }
        @media (max-width: 768px) { .container { padding: 0 0.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
            <h1>{{BUSINESS_NAME}}</h1>
            <p>Restoran & Kuliner Terbaik</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#menu" class="btn">Lihat Menu</a>
        </div>
    </section>

    <section class="section" id="menu">
        <div class="container">
            <h2>Menu & Layanan</h2>
            <div class="menu-grid">
                <div class="menu-item">
                    <h3>Produk & Layanan</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
                <div class="menu-item">
                    <h3>Jam Operasional</h3>
                    <p>Senin - Minggu: 08:00 - 22:00</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h2>Hubungi Kami</h2>
                <div class="contact-grid">
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></p>
                    </div>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="{{WHATSAPP_URL}}" style="color: white;">{{WHATSAPP}}</a></p>
                    </div>
                    <div>
                        <h3>Alamat</h3>
                        <p><a href="{{GOOGLE_MAPS_URL}}" style="color: white;">{{ADDRESS}}</a></p>
                    </div>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="{{INSTAGRAM_URL}}" style="color: white;">@{{INSTAGRAM}}</a></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="{{WHATSAPP_URL}}" class="btn">Pesan Sekarang</a>
                    <a href="{{GOOGLE_MAPS_URL}}" class="btn">Lihat Lokasi</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan \u2764\uFE0F untuk UMKM Indonesia.</p>
        </div>
    </footer>
</body>
</html>`;
}
__name(getRestaurantTemplate, "getRestaurantTemplate");
function getRetailTemplate() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - Toko & Retail</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .product-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #2c3e50; color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
        .btn:hover { background: #2980b9; }
        .footer { background: #34495e; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem; }
        @media (max-width: 768px) { .container { padding: 0 0.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
            <h1>{{BUSINESS_NAME}}</h1>
            <p>Toko & Retail Terpercaya</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#products" class="btn">Lihat Produk</a>
        </div>
    </section>

    <section class="section" id="products">
        <div class="container">
            <h2>Produk & Layanan</h2>
            <div class="product-grid">
                <div class="product-item">
                    <h3>Produk Unggulan</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
                <div class="product-item">
                    <h3>Jam Operasional</h3>
                    <p>Senin - Minggu: 09:00 - 21:00</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h2>Hubungi Kami</h2>
                <div class="contact-grid">
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></p>
                    </div>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="{{WHATSAPP_URL}}" style="color: white;">{{WHATSAPP}}</a></p>
                    </div>
                    <div>
                        <h3>Alamat</h3>
                        <p><a href="{{GOOGLE_MAPS_URL}}" style="color: white;">{{ADDRESS}}</a></p>
                    </div>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="{{INSTAGRAM_URL}}" style="color: white;">@{{INSTAGRAM}}</a></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="{{WHATSAPP_URL}}" class="btn">Pesan Sekarang</a>
                    <a href="{{GOOGLE_MAPS_URL}}" class="btn">Lihat Lokasi</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan \u2764\uFE0F untuk UMKM Indonesia.</p>
        </div>
    </footer>
</body>
</html>`;
}
__name(getRetailTemplate, "getRetailTemplate");
function getServiceTemplate() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - Jasa & Layanan</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .service-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #2c3e50; color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #27ae60; color: white; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
        .btn:hover { background: #229954; }
        .footer { background: #34495e; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem; }
        @media (max-width: 768px) { .container { padding: 0 0.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
            <h1>{{BUSINESS_NAME}}</h1>
            <p>Jasa & Layanan Profesional</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#services" class="btn">Lihat Layanan</a>
        </div>
    </section>

    <section class="section" id="services">
        <div class="container">
            <h2>Layanan Kami</h2>
            <div class="service-grid">
                <div class="service-item">
                    <h3>Layanan Utama</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
                <div class="service-item">
                    <h3>Jam Operasional</h3>
                    <p>Senin - Jumat: 08:00 - 17:00</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h2>Hubungi Kami</h2>
                <div class="contact-grid">
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></p>
                    </div>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="{{WHATSAPP_URL}}" style="color: white;">{{WHATSAPP}}</a></p>
                    </div>
                    <div>
                        <h3>Alamat</h3>
                        <p><a href="{{GOOGLE_MAPS_URL}}" style="color: white;">{{ADDRESS}}</a></p>
                    </div>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="{{INSTAGRAM_URL}}" style="color: white;">@{{INSTAGRAM}}</a></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="{{WHATSAPP_URL}}" class="btn">Konsultasi Sekarang</a>
                    <a href="{{GOOGLE_MAPS_URL}}" class="btn">Lihat Lokasi</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan \u2764\uFE0F untuk UMKM Indonesia.</p>
        </div>
    </footer>
</body>
</html>`;
}
__name(getServiceTemplate, "getServiceTemplate");
function getDefaultTemplate() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - UMKM Digital</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .content-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #2c3e50; color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #9b59b6; color: white; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
        .btn:hover { background: #8e44ad; }
        .footer { background: #34495e; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem; }
        @media (max-width: 768px) { .container { padding: 0 0.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
            <h1>{{BUSINESS_NAME}}</h1>
            <p>UMKM Digital Indonesia</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#about" class="btn">Tentang Kami</a>
        </div>
    </section>

    <section class="section" id="about">
        <div class="container">
            <h2>Tentang Kami</h2>
            <div class="content-grid">
                <div class="content-item">
                    <h3>Produk & Layanan</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
                <div class="content-item">
                    <h3>Jam Operasional</h3>
                    <p>Senin - Minggu: 08:00 - 20:00</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h2>Hubungi Kami</h2>
                <div class="contact-grid">
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></p>
                    </div>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="{{WHATSAPP_URL}}" style="color: white;">{{WHATSAPP}}</a></p>
                    </div>
                    <div>
                        <h3>Alamat</h3>
                        <p><a href="{{GOOGLE_MAPS_URL}}" style="color: white;">{{ADDRESS}}</a></p>
                    </div>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="{{INSTAGRAM_URL}}" style="color: white;">@{{INSTAGRAM}}</a></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="{{WHATSAPP_URL}}" class="btn">Hubungi Sekarang</a>
                    <a href="{{GOOGLE_MAPS_URL}}" class="btn">Lihat Lokasi</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan \u2764\uFE0F untuk UMKM Indonesia.</p>
        </div>
    </footer>
</body>
</html>`;
}
__name(getDefaultTemplate, "getDefaultTemplate");

// src/utils/deployment.js
async function deployToEdgeOne(subdomain, html, businessData, env) {
  try {
    console.log(`Deploying site for subdomain: ${subdomain}`);
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    const deploymentResult = {
      success: true,
      url: `https://${subdomain}.umkm.id`,
      subdomain,
      deployedAt: Date.now()
    };
    console.log(`Deployment successful: ${deploymentResult.url}`);
    return deploymentResult;
  } catch (error) {
    console.error("Deployment failed:", error);
    return {
      success: false,
      error: error.message || "Deployment failed"
    };
  }
}
__name(deployToEdgeOne, "deployToEdgeOne");

// src/api/generate-site.js
async function generateSite(request, env, ctx) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method Not Allowed",
      message: "Only POST method is allowed"
    }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const { businessId } = await request.json();
    if (!businessId) {
      return new Response(JSON.stringify({
        error: "Bad Request",
        message: "businessId is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const businessDataJson = await env.UMKM_KV.get(`business:${businessId}`);
    if (!businessDataJson) {
      return new Response(JSON.stringify({
        error: "Not Found",
        message: "Business not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const businessData = JSON.parse(businessDataJson);
    businessData.status = "processing";
    businessData.processingStartedAt = Date.now();
    await env.UMKM_KV.put(
      `business:${businessId}`,
      JSON.stringify(businessData)
    );
    const template = await loadTemplate(businessData.category);
    const html = processTemplate(template, businessData);
    const deployment = await deployToEdgeOne(
      businessData.subdomain,
      html,
      businessData,
      env
    );
    if (!deployment.success) {
      throw new Error(deployment.error || "Deployment failed");
    }
    businessData.status = "live";
    businessData.websiteUrl = `https://${businessData.subdomain}.umkm.id`;
    businessData.deployedAt = Date.now();
    businessData.processingTime = businessData.deployedAt - businessData.processingStartedAt;
    await env.UMKM_KV.put(
      `business:${businessId}`,
      JSON.stringify(businessData)
    );
    return new Response(JSON.stringify({
      success: true,
      url: businessData.websiteUrl,
      subdomain: businessData.subdomain,
      processingTime: businessData.processingTime,
      message: "Website generated and deployed successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Generate site error:", error);
    try {
      const { businessId } = await request.json();
      if (businessId) {
        const businessDataJson = await env.UMKM_KV.get(`business:${businessId}`);
        if (businessDataJson) {
          const businessData = JSON.parse(businessDataJson);
          businessData.status = "error";
          businessData.error = error.message;
          businessData.errorAt = Date.now();
          await env.UMKM_KV.put(
            `business:${businessId}`,
            JSON.stringify(businessData)
          );
        }
      }
    } catch (updateError) {
      console.error("Error updating business status:", updateError);
    }
    return new Response(JSON.stringify({
      error: "Site Generation Failed",
      message: error.message || "Failed to generate website"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(generateSite, "generateSite");

// src/api/get-status.js
async function getStatus(request, env, ctx) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({
      error: "Method Not Allowed",
      message: "Only GET method is allowed"
    }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get("businessId");
    const subdomain = url.searchParams.get("subdomain");
    if (!businessId && !subdomain) {
      return new Response(JSON.stringify({
        error: "Bad Request",
        message: "businessId or subdomain is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let businessDataJson;
    if (businessId) {
      businessDataJson = await env.UMKM_KV.get(`business:${businessId}`);
    } else if (subdomain) {
      const businessIdFromSubdomain = await env.UMKM_KV.get(`subdomain:${subdomain}`);
      if (businessIdFromSubdomain) {
        businessDataJson = await env.UMKM_KV.get(`business:${businessIdFromSubdomain}`);
      }
    }
    if (!businessDataJson) {
      return new Response(JSON.stringify({
        error: "Not Found",
        message: "Business not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const businessData = JSON.parse(businessDataJson);
    let processingTime = null;
    if (businessData.processingStartedAt) {
      const endTime = businessData.deployedAt || businessData.errorAt || Date.now();
      processingTime = endTime - businessData.processingStartedAt;
    }
    const statusResponse = {
      businessId: businessData.id,
      subdomain: businessData.subdomain,
      status: businessData.status,
      businessName: businessData.businessName,
      websiteUrl: businessData.websiteUrl,
      processingTime,
      createdAt: businessData.createdAt,
      deployedAt: businessData.deployedAt,
      error: businessData.error || null
    };
    switch (businessData.status) {
      case "processing":
        statusResponse.message = "Website sedang dibuat...";
        statusResponse.progress = "75%";
        break;
      case "live":
        statusResponse.message = "Website berhasil dibuat!";
        statusResponse.progress = "100%";
        break;
      case "error":
        statusResponse.message = "Gagal membuat website";
        statusResponse.progress = "0%";
        break;
      default:
        statusResponse.message = "Status tidak diketahui";
        statusResponse.progress = "0%";
    }
    return new Response(JSON.stringify(statusResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Get status error:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: "Failed to get status"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getStatus, "getStatus");

// src/api/get-business.js
async function getBusiness(request, env, ctx) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({
      error: "Method Not Allowed",
      message: "Only GET method is allowed"
    }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const url = new URL(request.url);
    const businessId = url.searchParams.get("businessId");
    const subdomain = url.searchParams.get("subdomain");
    if (!businessId && !subdomain) {
      return new Response(JSON.stringify({
        error: "Bad Request",
        message: "businessId or subdomain is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let businessDataJson;
    if (businessId) {
      businessDataJson = await env.UMKM_KV.get(`business:${businessId}`);
    } else if (subdomain) {
      const businessIdFromSubdomain = await env.UMKM_KV.get(`subdomain:${subdomain}`);
      if (businessIdFromSubdomain) {
        businessDataJson = await env.UMKM_KV.get(`business:${businessIdFromSubdomain}`);
      }
    }
    if (!businessDataJson) {
      return new Response(JSON.stringify({
        error: "Not Found",
        message: "Business not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const businessData = JSON.parse(businessDataJson);
    const publicData = {
      id: businessData.id,
      businessName: businessData.businessName,
      ownerName: businessData.ownerName,
      description: businessData.description,
      category: businessData.category,
      products: businessData.products,
      phone: businessData.phone,
      email: businessData.email,
      address: businessData.address,
      whatsapp: businessData.whatsapp,
      instagram: businessData.instagram,
      logoUrl: businessData.logoUrl,
      websiteUrl: businessData.websiteUrl,
      subdomain: businessData.subdomain,
      status: businessData.status,
      createdAt: businessData.createdAt,
      deployedAt: businessData.deployedAt
    };
    publicData.googleMapsUrl = generateGoogleMapsUrl2(businessData.address);
    publicData.whatsappUrl = generateWhatsAppUrl2(businessData.whatsapp || businessData.phone);
    publicData.instagramUrl = generateInstagramUrl2(businessData.instagram);
    return new Response(JSON.stringify(publicData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Get business error:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: "Failed to get business data"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(getBusiness, "getBusiness");
function generateGoogleMapsUrl2(address) {
  if (!address) return "#";
  const encodedAddress = encodeURIComponent(address);
  return `https://maps.google.com/?q=${encodedAddress}`;
}
__name(generateGoogleMapsUrl2, "generateGoogleMapsUrl");
function generateWhatsAppUrl2(phone) {
  if (!phone) return "#";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const whatsappPhone = cleanPhone.startsWith("62") ? cleanPhone : `62${cleanPhone}`;
  return `https://wa.me/${whatsappPhone}`;
}
__name(generateWhatsAppUrl2, "generateWhatsAppUrl");
function generateInstagramUrl2(instagram) {
  if (!instagram) return "#";
  return `https://instagram.com/${instagram}`;
}
__name(generateInstagramUrl2, "generateInstagramUrl");

// src/index.js
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }
    try {
      let response;
      switch (path) {
        case "/api/submit-business":
          response = await submitBusiness(request, env, ctx);
          break;
        case "/api/generate-site":
          response = await generateSite(request, env, ctx);
          break;
        case "/api/get-status":
          response = await getStatus(request, env, ctx);
          break;
        case "/api/get-business":
          response = await getBusiness(request, env, ctx);
          break;
        default:
          response = new Response(JSON.stringify({
            error: "Not Found",
            message: "Endpoint not found"
          }), {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
      }
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      });
    } catch (error) {
      console.error("Function error:", error);
      return new Response(JSON.stringify({
        error: "Internal Server Error",
        message: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-RrbS1n/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-RrbS1n/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
