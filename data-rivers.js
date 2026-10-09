/* Bizzing India — RIVERS IN ORDER, for Naksha L5 "Nadi" (games spec §4.3).

   Each river lists the states of the map it passes, IN ORDER going downstream, from where it
   rises (or enters India) — the state codes are map-data.js's, the Survey of India depiction,
   J&K whole. A state the river only borders is still on its way and is named in `along`.

   WHERE THE FIGURES CAME FROM. Every course is read from a government page: the Central Water
   Commission's basin pages and water-quality year books, the India-WRIS wiki (Ministry of Jal
   Shakti / CWC), the National Mission for Clean Ganga, the Inland Waterways Authority's
   feasibility reports, NCERT, and the states' own water-resources and district pages. Nothing is
   typed from memory. The pages were read through a web search on 2026-10-09 — this build
   machine's network could not open them directly — so a reviewer should open each URL once.

   CUT for want of a single sourced order (the river runs as a border between two states for
   long stretches, so "in order" has no one answer): Yamuna, Chambal, Son, Ravi, Ghaghara,
   Gandak. CUT because the map gives them one state only (nothing to order): Indus, Jhelum.

   tools/check-naksha.js holds it: every river has a source with a URL, every state is on the
   map, and each state on a course touches the next one on the map's own outlines. */
window.IND_RIVERS = (function () {
  var A = '2026-10-09';
  function s(title, url, publisher) { return { title: title, url: url, publisher: publisher, accessed: A }; }
  var WRIS = 'India-WRIS (Ministry of Jal Shakti / Central Water Commission)';
  var CWC = 'Central Water Commission, Ministry of Jal Shakti';
  var IWAI = 'Inland Waterways Authority of India';
  return {
    badge: 'aaj',
    accessed: A,
    rivers: [
      { id: 'ganga', name: 'Ganga', badge: 'aaj', age_gate: 4,
        course: ['UK', 'UP', 'BR', 'JH', 'WB'], start: 'rises',
        teach: 'It begins at the Gangotri glacier in Uttarakhand and runs about 2,525 km to the sea through these five states.',
        sources: [
          s('Ganga Basin', 'https://indiawris.gov.in/wiki/doku.php?id=ganga', WRIS),
          s('Namami Gange Programme — at a Glance (five main-stem states; length 2,525 km)', 'https://nmcg.nic.in/pdf/NGP-At%20a%20Glance%20(Final%20Version%20Printed).pdf', 'National Mission for Clean Ganga, Ministry of Jal Shakti')
        ] },
      { id: 'godavari', name: 'Godavari', badge: 'aaj', age_gate: 4,
        course: ['MH', 'TG', 'AP'], start: 'rises',
        teach: 'It rises near Trimbakeshwar in Nashik district, Maharashtra, and flows about 1,465 km south-east to the Bay of Bengal.',
        sources: [
          s('Godavari Basin — water quality year book 2016-17 ("through Maharashtra, Telangana and Andhra Pradesh, it falls into the Bay of Bengal")', 'https://www.cwc.gov.in/sites/default/files/admin/10BGCWQYB16-17.pdf', CWC),
          s('Godavari Basin', 'https://indiawris.gov.in/wiki/doku.php?id=godavari', WRIS)
        ] },
      { id: 'krishna', name: 'Krishna', badge: 'aaj', age_gate: 4,
        course: ['MH', 'KA', 'TG', 'AP'], start: 'rises',
        teach: 'It rises near Mahabaleshwar in Satara district, Maharashtra, crosses Karnataka, enters Telangana at Jurala, and meets the Bay of Bengal at Hamsaladeevi in Andhra Pradesh.',
        sources: [
          s('Krishna Basin', 'https://indiawris.gov.in/wiki/doku.php?id=krishna', WRIS),
          s('Final Feasibility Report, National Waterway 4 extension — Krishna River ("flows through the state of Karnataka before entering Telangana")', 'https://iwai.nic.in/sites/default/files/2045754279NW-04%20EXTN%20Krishna%20River%20Final%20FSR.pdf', IWAI),
          s('Jurala Dam — near the entry point of the Krishna into Telangana from Karnataka', 'https://gadwal.telangana.gov.in/tourist-place/jurala-dam/', 'Jogulamba Gadwal district, Government of Telangana')
        ] },
      { id: 'kaveri', name: 'Kaveri', also: 'Cauvery', badge: 'aaj', age_gate: 4,
        course: ['KA', 'TN'], start: 'rises',
        teach: 'It rises at Talakaveri in Kodagu, Karnataka, runs east for about 320 km in Karnataka, then enters Tamil Nadu and goes on to the Bay of Bengal.',
        sources: [
          s('The Cauvery River', 'https://indiawris.gov.in/wiki/doku.php?id=cauvery', WRIS),
          s('Krishnaraja Sagar — the Cauvery "traverses eastwards in Karnataka for about 320 km before entering Tamil Nadu"', 'https://karunadu.karnataka.gov.in/destinationmysore/KRS.html', 'Department of Tourism, Mysuru, Government of Karnataka'),
          s('Cauvery River', 'https://waterresources.karnataka.gov.in/new-page/Cauvery%20River/en', 'Water Resources Department, Government of Karnataka')
        ] },
      { id: 'narmada', name: 'Narmada', badge: 'aaj', age_gate: 4,
        course: ['MP', 'MH', 'GJ'], along: ['MH'], start: 'rises',
        teach: 'It rises at Amarkantak in Madhya Pradesh, runs along Maharashtra’s border with Madhya Pradesh and then with Gujarat, and meets the sea in the Gulf of Khambhat.',
        sources: [
          s('Narmada Basin (about 1,077 km in Madhya Pradesh; 35 km as the Madhya Pradesh–Maharashtra boundary; 39 km as the Maharashtra–Gujarat boundary; the rest in Gujarat)', 'https://indiawris.gov.in/wiki/doku.php?id=narmada', WRIS),
          s('About the Narmada', 'https://nvdawms.mp.gov.in/aboutUs', 'Narmada Valley Development Authority, Government of Madhya Pradesh'),
          s('Basin Details', 'https://cwc.gov.in/nbo/about-basins', CWC + ' — Narmada Basin Organisation')
        ] },
      { id: 'tapi', name: 'Tapi', also: 'Tapti', badge: 'aaj', age_gate: 4,
        course: ['MP', 'MH', 'GJ'], start: 'rises',
        teach: 'It rises near Multai in Betul district, Madhya Pradesh, flows about 282 km there, 228 km in Maharashtra and 214 km in Gujarat, and passes Surat on its way to the sea.',
        sources: [
          s('Tapi Basin — water year book 2011-12, chapter 1', 'https://cwc.gov.in/sites/default/files/ntbouser/tapiwyb2011-12.pdf', CWC),
          s('Tapi Basin', 'https://indiawris.gov.in/wiki/doku.php?id=tapi', WRIS),
          s('Tapi River', 'https://guj-nwrws.gujarat.gov.in/showpage.aspx?contentid=1500&lang=english', 'Narmada, Water Resources, Water Supply and Kalpsar Department, Government of Gujarat')
        ] },
      { id: 'mahanadi', name: 'Mahanadi', badge: 'aaj', age_gate: 4,
        course: ['CT', 'OR'], start: 'rises',
        teach: 'It rises near Sihawa in Chhattisgarh; of its 851 km, about 357 km are in Chhattisgarh and 494 km in Odisha, where it reaches the Bay of Bengal.',
        sources: [
          s('Basin Details (Mahanadi & Eastern Rivers Organisation)', 'https://cwc.gov.in/mero/about-basin', CWC),
          s('India: Physical Environment, chapter 3, Drainage System (Class 11)', 'https://ncert.nic.in/textbook/pdf/kegy103.pdf', 'NCERT'),
          s('Mahanadi Basin', 'https://indiawris.gov.in/wiki/doku.php?id=mahanadi', WRIS)
        ] },
      { id: 'brahmaputra', name: 'Brahmaputra', badge: 'aaj', age_gate: 4,
        course: ['AR', 'AS'], start: 'enters',
        teach: 'It enters India in Arunachal Pradesh, where it is called the Siang, takes the name Brahmaputra near Sadiya, and crosses Assam from east to west before it enters Bangladesh.',
        sources: [
          s('River info — the Brahmaputra', 'https://indiawris.gov.in/wiki/doku.php?id=river_info', WRIS),
          s('Brahmaputra Basin', 'https://indiawris.gov.in/wiki/doku.php?id=brahmaputra', WRIS),
          s('Geophysical features — the Brahmaputra crosses Assam from east to west', 'https://asbb.assam.gov.in/information-services/detail/geophysical-features', 'Assam State Biodiversity Board, Government of Assam')
        ] },
      { id: 'sutlej', name: 'Sutlej', also: 'Satluj', badge: 'aaj', age_gate: 4,
        course: ['HP', 'PB'], start: 'enters',
        teach: 'It enters India at Shipki in Kinnaur, Himachal Pradesh, leaves the hills at Bhakra to enter Punjab, and is joined there by the Beas near Harike.',
        sources: [
          s('Satluj', 'https://indiawris.gov.in/wiki/doku.php?id=satluj', WRIS),
          s('About Kinnaur — the Satluj enters at Shipki', 'https://hpkinnaur.nic.in/about-district/', 'District Administration Kinnaur, Government of Himachal Pradesh'),
          s('Rivers of Himachal Pradesh', 'https://hpenvis.nic.in/Database/Rivers_3769.aspx', 'HP ENVIS Hub, Government of Himachal Pradesh'),
          s('Harike Wildlife Sanctuary — the barrage below the meeting of the Beas and the Sutlej', 'https://wildlife.punjab.gov.in/tourism_page/1/protected-area-detail/index.html', 'Department of Forests & Wildlife Preservation, Government of Punjab')
        ] },
      { id: 'beas', name: 'Beas', badge: 'aaj', age_gate: 4,
        course: ['HP', 'PB'], start: 'rises',
        teach: 'It rises at Beas Kund near the Rohtang Pass in Himachal Pradesh, and in Punjab it joins the Sutlej near Harike.',
        sources: [
          s('Directory of Water Resources in Himachal Pradesh', 'https://hpccc.hp.gov.in/SCCC%20Reports/Water%20Sources%20in%20Himachal%20Pradesh.pdf', 'State Centre on Climate Change, Government of Himachal Pradesh'),
          s('Harike Wildlife Sanctuary — the barrage below the meeting of the Beas and the Sutlej', 'https://wildlife.punjab.gov.in/tourism_page/1/protected-area-detail/index.html', 'Department of Forests & Wildlife Preservation, Government of Punjab'),
          s('Prevention and Control of Pollution in River Beas', 'https://hppcb.nic.in/NGT/RAP-V-Beas.pdf', 'Himachal Pradesh State Pollution Control Board')
        ] },
      { id: 'chenab', name: 'Chenab', badge: 'aaj', age_gate: 4,
        course: ['HP', 'JK'], start: 'rises',
        teach: 'Two streams, the Chandra and the Bhaga, meet at Tandi in Lahaul, Himachal Pradesh, to make the Chenab; it crosses the Pangi valley and enters Kishtwar district in Jammu and Kashmir.',
        sources: [
          s('Directory of Water Resources in Himachal Pradesh', 'https://hpccc.hp.gov.in/SCCC%20Reports/Water%20Sources%20in%20Himachal%20Pradesh.pdf', 'State Centre on Climate Change, Government of Himachal Pradesh'),
          s('Rivers of Himachal Pradesh', 'https://hpenvis.nic.in/Database/Rivers_3769.aspx', 'HP ENVIS Hub, Government of Himachal Pradesh'),
          s('Final Feasibility Report, National Waterway 26 — Chenab River', 'https://iwai.nic.in/sites/default/files/7525996679NW-26%20Final%20FSR%20Chenab%20River.pdf', IWAI)
        ] },
      { id: 'teesta', name: 'Teesta', badge: 'aaj', age_gate: 4,
        course: ['SK', 'WB'], start: 'rises',
        teach: 'It rises high in North Sikkim, forms the border between Sikkim and West Bengal from Rangpo, comes down to the plains at Sevoke, and flows on into Bangladesh.',
        sources: [
          s('Basin Details: Teesta and Bhagirathi Damodar Basin Organisation', 'https://www.cwc.gov.in/tbo/about-basins', CWC),
          s('Annual Flood Report 2007 — the Teesta enters the plains at Sevoke', 'https://wbiwd.gov.in/uploads/anual_flood_report/ANNUAL_FLOOD_REPORT_2007.pdf', 'Irrigation & Waterways Directorate, Government of West Bengal')
        ] },
      { id: 'mahi', name: 'Mahi', badge: 'aaj', age_gate: 4,
        course: ['MP', 'RJ', 'GJ'], start: 'rises',
        teach: 'It rises in Dhar district, Madhya Pradesh, enters Rajasthan at Banswara, and crosses Gujarat to the Gulf of Khambhat.',
        sources: [
          s('Mahi Basin', 'https://indiawris.gov.in/wiki/doku.php?id=mahi', WRIS),
          s('Hydrogeological Atlas of Rajasthan — Mahi River Basin (2013): the river enters Rajasthan at Banswara', 'https://phedwater.rajasthan.gov.in/content/dam/doitassets/water/Ground%20Water/Pdf/PublicReports/Groundwater_Atlas/Basinwise/Mahi%20River%20basin.pdf', 'Ground Water Department, Government of Rajasthan')
        ] },
      { id: 'sabarmati', name: 'Sabarmati', badge: 'aaj', age_gate: 4,
        course: ['RJ', 'GJ'], start: 'rises',
        teach: 'It rises in the Aravalli hills near Tepur in Udaipur district, Rajasthan, and flows south-west through Gujarat, past Ahmedabad, to the Gulf of Khambhat.',
        sources: [
          s('Sabarmati Basin', 'https://indiawris.gov.in/wiki/doku.php?id=sabarmati', WRIS),
          s('Mahi, Sabarmati and other west-flowing rivers — water year book 2016-17', 'https://cwc.gov.in/sites/default/files/admin/9B_N&TBO_Gandhinagar_Mahi_Sabarmati_OWFR_WYB_2016-17.pdf', CWC)
        ] },
      { id: 'damodar', name: 'Damodar', badge: 'aaj', age_gate: 4,
        course: ['JH', 'WB'], start: 'rises',
        teach: 'It rises on the Chota Nagpur plateau in Jharkhand; about 380 km of it is in Jharkhand and about 160 km in West Bengal, where its waters reach the Rupnarayan and the Hooghly.',
        sources: [
          s('Final Feasibility Report, National Waterway 29 — Damodar River', 'https://iwai.nic.in/sites/default/files/7443443859NW-29%20Final%20FSR%20Damodar%20River.pdf', IWAI),
          s('Basin Details: Teesta and Bhagirathi Damodar Basin Organisation', 'https://www.cwc.gov.in/tbo/about-basins', CWC)
        ] }
    ]
  };
})();
