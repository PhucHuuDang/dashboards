import { createLocation, Location } from "./location-mock";

export const universityLocations: Location[] = [
  // ===== HÀ NỘI =====
  createLocation(
    "uni-hn-1",
    "Đại học Quốc gia Hà Nội",
    "Vietnam National University, Hanoi",
    "144 Xuân Thủy, Cầu Giấy, Hà Nội",
    "university",
    21.0373,
    105.7829,
    4.7,
    true
  ),
  createLocation(
    "uni-hn-2",
    "Đại học Bách Khoa Hà Nội",
    "Top engineering university in Vietnam",
    "1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    "university",
    21.0049,
    105.8431,
    4.6
  ),
  createLocation(
    "uni-hn-3",
    "Đại học Kinh tế Quốc dân",
    "National Economics University",
    "207 Giải Phóng, Hai Bà Trưng, Hà Nội",
    "university",
    20.9995,
    105.8467,
    4.5
  ),
  createLocation(
    "uni-hn-4",
    "Học viện Ngoại giao",
    "Diplomatic Academy of Vietnam",
    "69 Chùa Láng, Đống Đa, Hà Nội",
    "university",
    21.0217,
    105.8056,
    4.4
  ),
  createLocation(
    "uni-hn-5",
    "Đại học Sư phạm Hà Nội",
    "Hanoi National University of Education",
    "136 Xuân Thủy, Cầu Giấy, Hà Nội",
    "university",
    21.0379,
    105.7836,
    4.5
  ),

  // ===== TP. HỒ CHÍ MINH =====
  createLocation(
    "uni-hcm-1",
    "Đại học Quốc gia TP.HCM",
    "Vietnam National University, HCM",
    "Khu phố 6, Thủ Đức, TP.HCM",
    "university",
    10.87,
    106.8034,
    4.7,
    true
  ),
  createLocation(
    "uni-hcm-2",
    "Đại học Bách Khoa TP.HCM",
    "Ho Chi Minh City University of Technology",
    "268 Lý Thường Kiệt, Quận 10, TP.HCM",
    "university",
    10.772,
    106.6596,
    4.6
  ),
  createLocation(
    "uni-hcm-3",
    "Đại học Kinh tế TP.HCM",
    "University of Economics Ho Chi Minh City",
    "59C Nguyễn Đình Chiểu, Quận 3, TP.HCM",
    "university",
    10.7845,
    106.6914,
    4.5
  ),
  createLocation(
    "uni-hcm-4",
    "Đại học Khoa học Tự nhiên",
    "University of Science - VNUHCM",
    "227 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    "university",
    10.7628,
    106.6822,
    4.4
  ),
  createLocation(
    "uni-hcm-5",
    "Đại học Công nghệ Thông tin",
    "University of Information Technology",
    "KP6, Thủ Đức, TP.HCM",
    "university",
    10.8707,
    106.803,
    4.6
  ),

  // ===== ĐÀ NẴNG =====
  createLocation(
    "uni-dn-1",
    "Đại học Đà Nẵng",
    "University of Danang",
    "41 Lê Duẩn, Hải Châu, Đà Nẵng",
    "university",
    16.0678,
    108.2208,
    4.4
  ),
  createLocation(
    "uni-dn-2",
    "Đại học Bách Khoa Đà Nẵng",
    "Danang University of Science and Technology",
    "54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng",
    "university",
    16.0757,
    108.1522,
    4.5
  ),

  // ===== HUẾ =====
  createLocation(
    "uni-hue-1",
    "Đại học Huế",
    "Hue University",
    "3 Lê Lợi, TP Huế",
    "university",
    16.4637,
    107.5954,
    4.4
  ),
  createLocation(
    "uni-hue-2",
    "Đại học Y Dược Huế",
    "Hue University of Medicine and Pharmacy",
    "6 Ngô Quyền, TP Huế",
    "university",
    16.465,
    107.5919,
    4.5
  ),

  // ===== CẦN THƠ =====
  createLocation(
    "uni-ct-1",
    "Đại học Cần Thơ",
    "Can Tho University",
    "Khu II, Ninh Kiều, Cần Thơ",
    "university",
    10.0308,
    105.7707,
    4.6,
    true
  ),

  // ===== ĐÀ LẠT =====
  createLocation(
    "uni-dl-1",
    "Đại học Đà Lạt",
    "Dalat University",
    "1 Phù Đổng Thiên Vương, Đà Lạt",
    "university",
    11.9566,
    108.4446,
    4.4
  ),

  // ===== HẢI PHÒNG =====
  createLocation(
    "uni-hp-1",
    "Đại học Hàng Hải Việt Nam",
    "Vietnam Maritime University",
    "484 Lạch Tray, Hải Phòng",
    "university",
    20.8449,
    106.6881,
    4.5
  ),

  // ===== THÁI NGUYÊN =====
  createLocation(
    "uni-tn-1",
    "Đại học Thái Nguyên",
    "Thai Nguyen University",
    "Tân Thịnh, Thái Nguyên",
    "university",
    21.587,
    105.8445,
    4.3
  ),

  // ===== VIN / FPT =====
  createLocation(
    "uni-private-1",
    "VinUniversity",
    "Private international university",
    "Vinhomes Ocean Park, Gia Lâm, Hà Nội",
    "university",
    21.0031,
    105.9556,
    4.8,
    true
  ),
  createLocation(
    "uni-private-2",
    "FPT University Hanoi",
    "Technology-focused private university",
    "Khu CNC Hòa Lạc, Hà Nội",
    "university",
    21.0133,
    105.5258,
    4.6
  ),
  createLocation(
    "uni-private-3",
    "FPT University HCM",
    "FPT University Ho Chi Minh City",
    "Khu CNC Quận 9, TP.HCM",
    "university",
    10.8412,
    106.8095,
    4.5
  ),
];
