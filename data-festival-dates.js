/* Bizzing India — DATED YEARS for Panchang L3 "Chaand" (games spec §4.4, T12).

   The Government of India's own holiday list, year by year: the Department of Personnel &
   Training (Ministry of Personnel, Public Grievances and Pensions) issues an Office Memorandum
   each year, "Holidays to be observed in Central Government Offices during the year …", whose
   Annexure I lists the holidays for the Central Government's offices in Delhi / New Delhi with
   the Gregorian date, the Saka (Indian national calendar) date and the day of the week.

   WHERE THE FIGURES CAME FROM. Each date below is that Annexure's, read on 2026-10-09 through a
   web search of the O.M. and of the pages that reproduce its table (the build machine's network
   could not open the pages directly — a reviewer should open each URL once). Where the Annexure
   gave a Saka date and a weekday they are kept here too, and tools/check-panchang.js works both
   out again from the Gregorian date, so a figure mis-copied anywhere fails the build. Nothing
   is typed from memory; a date no source gave is left out, never filled in.

   `date` is the date the year's O.M. listed. Where a later O.M. moved it after the moon was
   sighted, `moved` says so with its own source — and the drift is still worked out from the
   listed dates, the same kind of figure every year.

   THE LESSON IS COMPUTED, NEVER TYPED. "About N days earlier each year" is the average gap
   between one year's date and the next, worked out from these dates by the game itself.

   CUT: Id-e-Milad (also moon-sighted) — not asked for by the level, so not carried. Holi and
   Diwali are carried for contrast only: the game shows where their dates fall, and says nothing
   about their calendars that these lists do not show. */
window.IND_FESTIVAL_DATES = (function () {
  var A = '2026-10-09';
  function s(title, url, publisher) { return { title: title, url: url, publisher: publisher, accessed: A }; }
  var DOPT = 'Department of Personnel & Training, Ministry of Personnel, Public Grievances and Pensions, Government of India';
  var INDEX = 'https://doptcirculars.nic.in/Default.aspx?URL=dFaVfDsok83H';
  function om(year, no, issued, copies) {
    return { year: year, om: no, issued: issued,
      sources: [s('Holidays to be observed in Central Government Offices during the year ' + year + ' — O.M. ' + no + ', ' + issued + ', Annexure I (DoPT circulars, Holidays)', INDEX, DOPT)].concat(copies) };
  }
  var SN = 'StaffNews (the O.M.’s table reproduced)', GC = 'GConnect (the O.M. reproduced)';
  var CAG = 'Comptroller and Auditor General of India (an office’s copy of the list)';
  var LISTS = {
    2018: om(2018, 'F.No. 12/3/2017-JCA-2', 'June 2017', [
      s('Holidays to be observed in Central Government Offices during the Year 2018', 'https://www.staffnews.in/2017/06/holidays-to-be-observed-in-central-2.html', SN)]),
    2019: om(2019, 'F.No. 12/2/2018-JCA-2', '11 July 2018', [
      s('List of Holidays 2019: Gazetted Leave', 'https://www.staffnews.in/2018/07/list-of-holidays-2019-gazetted-leave.html', SN),
      s('Central Government Holidays List 2019', 'https://www.gconnect.in/orders-in-brief/leave-ltc/leave/central-government-holidays-list-2019.html', GC)]),
    2020: om(2020, 'F.No. 12/1/2019-JCA-2', 'June 2019', [
      s('List of Gazetted Holidays during the Year 2020 for Administrative Offices of Central Govt located at Delhi/New Delhi', 'https://www.staffnews.in/2019/06/list-of-gazetted-holidays-during-year-2020.html', SN)]),
    2021: om(2021, 'F.No. 12/9/2020-JCA-2', '10 June 2020', [
      s('List of 17 Closed/Gazetted Holidays during the year 2021 for Central Govt. Offices located at Delhi/New Delhi', 'https://www.staffnews.in/2020/06/list-of-17-closed-gazatted-holidays-during-the-year-2021-for-central-govt-offices-located-at-delhi-new-delhi.html', SN)]),
    2022: om(2022, 'F.No. 12/3/2021-JCA-2', '8 June 2021', [
      s('List of Holidays during the year 2022: Gazetted Holidays', 'https://www.staffnews.in/2021/06/list-of-holidays-during-the-year-2022-gazetted-holidays.html', SN),
      s('Holiday List 2022', 'https://cag.gov.in/uploads/media/Holiday-List-DGA-F-C-2022-20210929122752.pdf', CAG)]),
    2023: om(2023, 'F.No. 12/5/2022-JCA', '16 June 2022', [
      s('List of Holidays 2023: Gazetted Holidays', 'https://www.staffnews.in/2022/06/list-of-holidays-2023-gazetted-holidays.html', SN),
      s('2023 Holiday List', 'https://cag.gov.in/uploads/media/2023-Holiday-List-062c177906f8592-90189505-06486e182b40f39-46151680.pdf', CAG)]),
    2024: om(2024, 'F.No. 12/2/2023-JCA', '3 July 2023', [
      s('List of Holidays 2024: Gazetted Holidays', 'https://www.staffnews.in/2023/07/list-of-holidays-2024-gazetted-holidays.html', SN),
      s('Holidays 2024', 'https://cag.gov.in/uploads/media/Holidays-2024-065964246e36ac6-96333070-06728af245d9186-21937572.pdf', CAG)]),
    2025: om(2025, 'F.No. 12/2/2023-JCA', '9 July 2024', [
      s('Gazetted Holidays to be observed in Central Government offices during the year 2025', 'https://www.staffnews.in/2024/07/gazetted-holidays-year-2025.html', SN)]),
    2026: om(2026, 'F.No. 12/2/2023-JCA', '3 July 2025', [
      s('List of Holidays 2026: Closed Holidays', 'https://www.staffnews.in/2025/07/list-of-holidays-2026-closed-holidays.html', SN),
      s('Holiday List 2026', 'https://cag.gov.in/uploads/media/Holiday-List-2026-069521fe6f358d0-89936988.pdf', CAG)]),
    2027: om(2027, 'F.No. 12/2/2023-JCA', '16 July 2026', [
      s('List of Holidays for the Year 2027 (Gazetted)', 'https://www.staffnews.in/2026/07/list-of-holidays-for-the-year-2027-gazetted.html', SN),
      s('Central Government Holiday List — 2027', 'https://www.gconnect.in/top-stories/central-government-holiday-list-2027.html', GC)])
  };
  /* the two 2018 changes to the Bakrid holiday, documented together by these four pages */
  var BAKRID_2018 = [
    s('Change in Holiday on account of Id-ul-Zuha (Bakrid)', 'https://pib.gov.in/newsite/PrintRelease.aspx?relid=181970', 'Press Information Bureau, Government of India'),
    s('Change in Holiday on account of Id-ul-Zuha (Bakrid)', 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1542936', 'Press Information Bureau, Government of India'),
    s('Change of Bakrid holiday from 22nd Aug to 23rd Aug 2018 — DoPT order', 'https://igecorner.com/change-of-bakrid-holiday-from-22nd-aug-to-23rd-aug-2018-dopt-order/', 'IGE Corner (the O.M. reproduced)'),
    s('Central Government Holiday for Bakrid will be 22nd August 2018', 'https://www.gconnect.in/orders-in-brief/leave-ltc/leave/central-government-holiday-for-bakrid-will-be-22nd-august-2018.html', GC)
  ];
  /* one holiday: its listed dates, each with its year's O.M. as its source */
  function holiday(id, name, calendar, rows, extra) {
    var dates = rows.map(function (r) {
      var d = { year: r[0], date: r[1], day: r[2] || null, saka: r[3] || null, sources: LISTS[r[0]].sources };
      if (r[4]) d.moved = r[4];
      return d;
    });
    return Object.assign({ id: id, name: name, calendar: calendar, badge: 'aaj', age_gate: 4, dates: dates,
      sources: [].concat.apply([], dates.map(function (d) { return d.sources; })).filter(function (x, i, a) { return a.indexOf(x) === i; }) }, extra || {});
  }

  return {
    accessed: A,
    lists: LISTS,
    /* the O.M.'s own rule: the moon decides, and the date may be moved */
    moonRule: {
      text: 'The date depends on the sighting of the moon, so the government may move the holiday by a day.',
      sources: LISTS[2025].sources.concat([
        s('Change of date of holiday on account of Muharram, 2021 (DoPT O.M. of 11 August 2021: notified for 19 August, held on 20 August after the moon was sighted)', 'https://www.staffnews.in/2021/08/change-in-the-date-of-holiday-on-account-of-muharram.html', SN)])
    },
    /* why the drift happens — said in words the sources use */
    why: {
      text: 'The Islamic calendar follows the moon alone, not the seasons.',
      sources: [
        s('Islamic calendar', 'https://www.britannica.com/topic/Islamic-calendar', 'Encyclopaedia Britannica'),
        s('How does the Hijri calendar work?', 'https://www.timeanddate.com/calendar/islamic-calendar.html', 'timeanddate.com')
      ]
    },
    holidays: [
      holiday('id-ul-fitr', 'Id-ul-Fitr', 'hijri', [
        [2018, '2018-06-16', 'Saturday', 'Jyaishtha 26'],
        [2019, '2019-06-05', 'Wednesday', 'Jyaishtha 15'],
        [2020, '2020-05-25', 'Monday', 'Jyaishtha 04'],
        [2021, '2021-05-14', 'Friday', 'Vaisakha 24'],
        [2022, '2022-05-03', 'Tuesday', 'Vaisakha 13'],
        [2023, '2023-04-22', 'Saturday', 'Vaisakha 02'],
        [2024, '2024-04-11', 'Thursday', 'Chaitra 22'],
        [2025, '2025-03-31', 'Monday', 'Chaitra 10'],
        [2026, '2026-03-21', 'Saturday', 'Phalguna 30'],
        [2027, '2027-03-10', 'Wednesday', 'Phalguna 19']
      ], { also: 'Eid-ul-Fitr', utsav: 'eid-ul-fitr' }),
      holiday('id-ul-zuha', 'Id-ul-Zuha (Bakrid)', 'hijri', [
        [2018, '2018-08-22', 'Wednesday', null, [
          { to: '2018-08-23', by: 'DoPT O.M. of 14 August 2018', sources: BAKRID_2018 },
          { to: '2018-08-22', by: 'DoPT O.M. of 20 August 2018, after the moon-sighting committee’s report; the 14 August O.M. withdrawn', sources: BAKRID_2018 }]],
        [2019, '2019-08-12', 'Monday', 'Sravana 21'],
        [2020, '2020-08-01', 'Saturday', 'Sravana 10'],
        [2021, '2021-07-21', 'Wednesday', 'Ashadha 30'],
        [2022, '2022-07-10', 'Sunday', 'Ashadha 19'],
        [2023, '2023-06-29', 'Thursday', 'Ashadha 08'],
        [2024, '2024-06-17', 'Monday', 'Jyaishtha 27'],
        [2025, '2025-06-07', 'Saturday', 'Jyaishtha 17'],
        [2026, '2026-05-27', 'Wednesday'],
        [2027, '2027-05-17', 'Monday', 'Vaisakha 27']
      ], { also: 'Eid-ul-Adha' }),
      holiday('muharram', 'Muharram', 'hijri', [
        [2018, '2018-09-21', 'Friday'],
        [2019, '2019-09-10', 'Tuesday', 'Bhadra 19'],
        [2020, '2020-08-30', 'Sunday', 'Bhadra 08'],
        [2021, '2021-08-19', 'Thursday', 'Sravana 28', [
          { to: '2021-08-20', by: 'DoPT O.M. of 11 August 2021, after the moon was sighted',
            sources: [
              s('Change in the date of Holiday on account of Muharram — DoP&T O.M. dated 11.08.2021', 'https://www.staffnews.in/2021/08/change-in-the-date-of-holiday-on-account-of-muharram.html', SN),
              s('Change of date of holiday on account of Muharram', 'https://www.gconnect.in/orders-in-brief/leave-ltc/leave/change-date-holiday-muharram-dopt.html', GC)] }]],
        [2022, '2022-08-09', 'Tuesday', 'Sravana 18'],
        [2023, '2023-07-29', 'Saturday', 'Sravana 07'],
        [2024, '2024-07-17', 'Wednesday', 'Ashadha 26'],
        [2025, '2025-07-06', 'Sunday', 'Ashadha 15'],
        [2026, '2026-06-26', 'Friday'],
        [2027, '2027-06-16', 'Wednesday', 'Jyaishtha 26']
      ]),
      /* for contrast only (calendar: null — no claim about their reckoning is made here) */
      holiday('holi', 'Holi', null, [
        [2018, '2018-03-02', 'Friday'],
        [2019, '2019-03-21', 'Thursday', 'Phalguna 30'],
        [2020, '2020-03-10', 'Tuesday', 'Phalguna 20'],
        [2021, '2021-03-29', 'Monday'],
        [2022, '2022-03-18', 'Friday'],
        [2023, '2023-03-08'],
        [2024, '2024-03-25', 'Monday', 'Chaitra 05'],
        [2025, '2025-03-14', 'Friday', 'Phalguna 23'],
        [2026, '2026-03-04', 'Wednesday', 'Phalguna 13'],
        [2027, '2027-03-23', 'Tuesday', 'Chaitra 02']
      ], { utsav: 'holi', contrast: true }),
      holiday('diwali', 'Diwali (Deepavali)', null, [
        [2018, '2018-11-07', 'Wednesday'],
        [2019, '2019-10-27', 'Sunday', 'Kartika 05'],
        [2020, '2020-11-14', 'Saturday', 'Kartika 23'],
        [2021, '2021-11-04', 'Thursday', 'Kartika 13'],
        [2022, '2022-10-24', 'Monday', 'Kartika 02'],
        [2023, '2023-11-12', 'Sunday', 'Kartika 21'],
        [2024, '2024-10-31', 'Thursday', 'Kartika 09'],
        [2025, '2025-10-20', 'Monday', 'Asvina 28'],
        [2026, '2026-11-08', 'Sunday', 'Kartika 17'],
        [2027, '2027-10-29', 'Friday', 'Kartika 07']
      ], { utsav: 'diwali', contrast: true })
    ]
  };
})();
