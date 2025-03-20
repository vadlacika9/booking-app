const counties = [
  { name: "Alba", code: "AB" },
  { name: "Arad", code: "AR" },
  { name: "Argeş", code: "AG" },
  { name: "Bacău", code: "BC" },
  { name: "Bihor", code: "BH" },
  { name: "Bistriţa-Năsăud", code: "BN" },
  { name: "Botoşani", code: "BT" },
  { name: "Brăila", code: "BR" },
  { name: "Braşov", code: "BV" },
  { name: 'Bucuresti', code: 'B'},
  { name: "Buzău", code: "BZ" },
  { name: "Călăraşi", code: "CL" },
  { name: "Caraş-Severin", code: "CS" },
  { name: "Cluj", code: "CJ" },
  { name: "Constanţa", code: "CT" },
  { name: "Covasna", code: "CV" },
  { name: "Dâmboviţa", code: "DB" },
  { name: "Dolj", code: "DJ" },
  { name: "Galaţi", code: "GL" },
  { name: "Giurgiu", code: "GR" },
  { name: "Gorj", code: "GJ" },
  { name: "Harghita", code: "HR" },
  { name: "Hunedoara", code: "HD" },
  { name: "Ialomiţa", code: "IL" },
  { name: "Iaşi", code: "IS" },
  { name: "Ilfov", code: "IF" },
  { name: "Maramureş", code: "MM" },
  { name: "Mehedinţi", code: "MH" },
  { name: "Mureş", code: "MS" },
  { name: "Neamţ", code: "NT" },
  { name: "Olt", code: "OT" },
  { name: "Prahova", code: "PH" },
  { name: "Sălaj", code: "SJ" },
  { name: "Satu Mare", code: "SM" },
  { name: "Sibiu", code: "SB" },
  { name: "Suceava", code: "SV" },
  { name: "Teleorman", code: "TR" },
  { name: "Timiş", code: "TM" },
  { name: "Tulcea", code: "TL" },
  { name: "Vâlcea", code: "VL" },
  { name: "Vaslui", code: "VS" },
  { name: "Vrancea", code: "VN" },
];

export const filterLocations = (data) => {
  const uniqueNames = new Set(); // Set az egyedi nevek tárolására

  return data.geonames
    .filter(location => {
      // Ha a név már benne van, kihagyjuk
      if (uniqueNames.has(location.toponymName)) {
        return false;
      }
      uniqueNames.add(location.toponymName);
      return location.fclName === "city, village,..." && location.population !== 0;
    })
    .sort((a, b) => a.toponymName.localeCompare(b.toponymName));
};

export default counties;