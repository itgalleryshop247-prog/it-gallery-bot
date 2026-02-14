
import React from 'react';

export const COLORS = {
  primary: '#FED700', // Premium Yellow from Footer
  secondary: '#000000', // Black
  background: '#FFFFFF', // White
  text: '#1F2937', // Gray-800
};

export const BUSINESS_INFO = {
  name: 'IT Gallery Shop',
  url: 'https://itgalleryshop.com',
  slogan: 'BUDGET-FRIENDLY. RELIABLE.',
  location: 'Mirpur-10, Dhaka',
  address: 'Fahad Plaza (3rd Floor), Plot 1 & 2, Rd 1, Mirpur-10, Dhaka 1216',
  hours: '10:00 AM - 10:00 PM (7 Days Open)',
  phone: '+880 1710-913724',
  whatsapp: '8801710913724',
  email: 'support@itgalleryshop.com',
  mapLink: 'https://maps.app.goo.gl/dWiDmdJsT7xfYf737',
};

export const POLICIES = {
  warranty: "আমাদের প্রতিটি ইউজড ল্যাপটপের সাথে পাচ্ছেন ১৫ দিনের রিপ্লেসমেন্ট গ্যারান্টি এবং মডেলভেদে ১ থেকে ৫ বছরের সার্ভিস ওয়ারেন্টি।",
  return: "পণ্য হাতে পাওয়ার ১৫ দিনের মধ্যে হার্ডওয়্যারজনিত সমস্যা থাকলে রিপ্লেসমেন্ট সুবিধা পাবেন।",
  usedStatus: "আমাদের সকল ল্যাপটপ এবং প্রোডাক্ট 'Used' বা 'Pre-owned', তবে আমরা প্রতিটি প্রোডাক্ট গুণগত মান যাচাই করে বিক্রি করি।",
  replacement: "গ্যারান্টি পিরিয়ডের মধ্যে কোনো যান্ত্রিক ত্রুটি দেখা দিলে আমরা সরাসরি পার্টস রিপ্লেস বা মডেল পরিবর্তনের সুবিধা দিয়ে থাকি।",
};

export const EMI_BANKS = [
  "City Bank", "EBL", "Standard Chartered", "BRAC Bank", "Dutch Bangla Bank", "Mutual Trust Bank", "UCB", "LankaBangla Finance"
];

// প্রোডাক্ট লিস্ট - Used Status সহ
export const MOCK_PRODUCTS: any[] = [
  {
    id: 101,
    name: "HP Victus 15-fa1093dx (Used)",
    price: 65000,
    regular_price: 68000,
    condition: "Used (Grade A+)",
    permalink: "https://itgalleryshop.com/product/hp-victus-15",
    images: [{ src: "https://picsum.photos/400/300?random=1" }],
    stock_status: "instock",
    short_description: "Core i5 13th Gen | 8GB RAM | 512GB SSD | RTX 3050 4GB",
    tags: ["Gaming", "Graphics", "Video Editing"],
    specs: {
      processor: "Intel Core i5-13420H",
      ram: "8GB DDR4",
      ssd: "512GB NVMe",
      graphics: "RTX 3050 6GB",
      display: "15.6\" FHD 144Hz",
      warranty: "15 Days Replacement, 2 Years Service Warranty"
    }
  },
  {
    id: 102,
    name: "ASUS TUF Gaming F15 (Used)",
    price: 72000,
    regular_price: 75000,
    condition: "Used (Excellent)",
    permalink: "https://itgalleryshop.com/product/asus-tuf-f15",
    images: [{ src: "https://picsum.photos/400/300?random=2" }],
    stock_status: "instock",
    short_description: "Core i5 12th Gen | 16GB RAM | 512GB SSD | RTX 3050",
    tags: ["Gaming", "Programming", "AutoCAD"],
    specs: {
      processor: "Intel Core i5-12500H",
      ram: "16GB DDR4",
      ssd: "512GB NVMe",
      graphics: "RTX 3050 4GB",
      display: "15.6\" FHD 144Hz",
      warranty: "15 Days Replacement, 3 Years Service Warranty"
    }
  },
  {
    id: 103,
    name: "Lenovo IdeaPad Slim 3 (Used)",
    price: 42000,
    regular_price: 45000,
    condition: "Used (Like New)",
    permalink: "https://itgalleryshop.com/product/lenovo-ideapad-slim-3",
    images: [{ src: "https://picsum.photos/400/300?random=3" }],
    stock_status: "instock",
    short_description: "Ryzen 5 7520U | 8GB RAM | 512GB SSD",
    tags: ["Office", "Student", "Freelancing"],
    specs: {
      processor: "AMD Ryzen 5 7520U",
      ram: "8GB LPDDR5",
      ssd: "512GB NVMe",
      graphics: "AMD Radeon 610M",
      display: "15.6\" FHD",
      warranty: "15 Days Replacement, 1 Year Service Warranty"
    }
  }
];
