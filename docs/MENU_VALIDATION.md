# MENU VALIDATION: Al Qadri Restaurant

Status: **Internally checked 2026-09-16. Awaiting owner sign-off.**
Method: every row in `MENU_DATA.md` compared against both printed-menu screenshots and the client's written list. Once `src/data/menu.ts` exists, `npm run validate` re-checks these numbers automatically on every build.

## 1. Total menu items
| Check | Expected | Result |
|---|---|---|
| Line items | 58 | 58 |
| Unique display names | 56 | 56 (Daal, Sabzi appear twice) |
| Unique slugs | 58 | 58 |

## 2. Category totals
| Category | Printed heading | Items |
|---|---|---|
| Breakfast | BreakFast | 18 |
| BBQ / Grill | B.B.Q | 9 |
| Curry | Curry | 13 |
| Rice | Rice | 3 |
| Special Lunch & Dinner | Special / Lunch & Dinner | 6 |
| Refreshment | Refreshment | 9 |
| **Total** | | **58** |

## 3. Price validation
| Check | Result |
|---|---|
| Every price matches the screenshot | Pass (58/58) |
| Every price matches the client's written list | Pass (58/58) |
| Slash prices preserved as separate values | Pass |
| Single-price items | 39 |
| Two-price items (shown as Half / Full) | 18: Lahori Chana, Aloo Qeema, Maghaz, Kaleji, Haleem, Daal (Breakfast), Sabzi (Breakfast), Chicken Charcoal, Daal (Curry), Sabzi (Curry), Chicken Handi, Mutton Handi, Mutton Fresh White Karahi, Chicken Fresh White Karahi, Mutton Fresh Karahi, Chicken Fresh Karahi, Samosa Chaat, Chana Chaat |
| Three-price items (no labels) | 1: Mix Grill 30 / 40 / 50 |
| Lowest price | 1 (Sada Chai, Roti) |
| Highest price | 60 (Mutton Fresh White Karahi, Full) |
| `.00` stripped only, no value changed | Pass |

Previously corrected in chat (do not regress): Mutton Palao is **10**, Malai Boti is **10**, Chicken Charcoal is **12/25**, Kheer is **3**, Milk Jalebi is **5**, Pakora and Jalebi are **20 per 1kg**, Samosa Chaat and Chana Chaat are **3/5**, Kabab Karahi is **22**, Daal Chawal is **8**.

## 4. Item name validation
Display follows the client's written list. Differences from the printed menu (as far as the low-resolution screenshot can be read):

| Display name | Printed as | Owner to confirm |
|---|---|---|
| Kashmiri Chai | Kashmeri Chai | [ ] |
| Chicken Qorma | Chicken Qoorma | [ ] |
| Mutton Qorma | Mutton Qoorma | [ ] |
| White Mutton Qorma | White Mutton Qoorma | [ ] |
| Chicken Biryani | Chicken Baryani | [ ] |
| Pakora (1kg) | 1kg Pakora | [ ] |
| Jalebi (1kg) | 1kg Jalebi | [ ] |

Kept exactly as printed at the client's request: **Moli Paratha**, **Anda Amlet**, **Alo Gosht**, **Aloo Paratha**, **Aloo Qeema**.

## 5. Ambiguities
1. **Half / Full meaning.** The print shows no labels for two-price items. Half / Full is applied to all 18 on the client's instruction. Owner to confirm it is correct for Samosa Chaat, Chana Chaat, Lahori Chana, Daal and Sabzi. [ ]
2. **Mix Grill sizes.** 30 / 40 / 50 has no printed size names. Displayed unlabelled until the owner names them. [ ]
3. **Duplicate dishes.** Daal and Sabzi appear in Breakfast (3/6) and Curry (4/6). Treated as separate items; confirm this is intentional. [ ]
4. **Urdu names.** Printed beside every dish but not transcribed (screenshot resolution too low). Owner can supply text. [ ]
5. **QR codes.** Two WhatsApp QR codes and one location QR are printed; their links cannot be read from the screenshot. Both phone numbers are used for WhatsApp; the Maps link is still needed. [ ]
6. **"Sajja" spelling.** Kept as printed. Confirm whether "Sajaa" should also appear. [ ]

## 6. Owner sign-off
- [ ] All 58 names and prices are correct
- [ ] Ambiguities 1-6 answered

Signed: ____________________ Date: __________

## Urdu and Arabic names (added 2026-09-16, owner to confirm)

The client asked for every menu item in Urdu and Arabic as well. These are translations of the printed English names, written by us. The printed menu also carries Urdu wording that we could not read from the photos, so if the owner wants the exact printed Urdu, send the two menu photos again and we will transcribe them instead. Prices and items are unchanged in every language.

| Category | English | Urdu | Arabic |
| --- | --- | --- | --- |
| **Breakfast** | Breakfast | ناشتہ | الإفطار |
| **BBQ / Grill** | BBQ / Grill | بار بی کیو | المشاوي |
| **Curry** | Curry | سالن | كاري |
| **Rice** | Rice | چاول | الأرز |
| **Special Lunch & Dinner** | Special Lunch & Dinner | خصوصی لنچ اور ڈنر | غداء وعشاء خاص |
| **Refreshment** | Refreshment | لوازمات | مرطبات |
| Breakfast | Sada Chai | سادہ چائے | شاي سادة |
| Breakfast | Fresh Chai | تازہ چائے | شاي طازج |
| Breakfast | Kashmiri Chai | کشمیری چائے | شاي كشميري |
| Breakfast | Sada Paratha | سادہ پراٹھا | باراتا سادة |
| Breakfast | Aloo Paratha | آلو پراٹھا | باراتا بالبطاطس |
| Breakfast | Moli Paratha | مولی پراٹھا | باراتا بالفجل |
| Breakfast | Anda Paratha | انڈا پراٹھا | باراتا بالبيض |
| Breakfast | Lahori Chana | لاہوری چنا | حمص لاهوري |
| Breakfast | Mutton Paya | مٹن پائے | باية الغنم |
| Breakfast | Nehari | نہاری | نهاري |
| Breakfast | Aloo Qeema | آلو قیمہ | لحم مفروم بالبطاطس |
| Breakfast | Maghaz | مغز | مخ مقلي |
| Breakfast | Kaleji | کلیجی | كبدة |
| Breakfast | Haleem | حلیم | هريس حليم |
| Breakfast | Daal | دال | دال عدس |
| Breakfast | Sabzi | سبزی | خضار |
| Breakfast | Anda Amlet | انڈا آملیٹ | عجة بيض |
| Breakfast | Anda Fry | انڈا فرائی | بيض مقلي |
| BBQ / Grill | Fish Fry | فش فرائی | سمك مقلي |
| BBQ / Grill | Chicken Charcoal | چکن چارکول | دجاج على الفحم |
| BBQ / Grill | Chicken Kabab | چکن کباب | كباب دجاج |
| BBQ / Grill | Chapli Kabab | چپلی کباب | كباب تشابلي |
| BBQ / Grill | Tikka Boti | تکہ بوٹی | قطع تكا |
| BBQ / Grill | Fish Grill | فش گرل | سمك مشوي |
| BBQ / Grill | Malai Boti | ملائی بوٹی | ملاي بوتي |
| BBQ / Grill | Mix Grill | مکس گرل | مشاوي مشكلة |
| BBQ / Grill | Chicken Tikka | چکن تکہ | تكا دجاج |
| Curry | Curry Pakora | کڑی پکوڑا | كاري باكورا |
| Curry | Tawa Qeema | توا قیمہ | لحم مفروم على الصاج |
| Curry | Roti | روٹی | خبز روتي |
| Curry | Daal | دال | دال عدس |
| Curry | Sabzi | سبزی | خضار |
| Curry | Alo Gosht | آلو گوشت | لحم بالبطاطس |
| Curry | Chicken Qorma | چکن قورمہ | قورمة دجاج |
| Curry | Sarson Ka Saag | سرسوں کا ساگ | ساج الخردل |
| Curry | Mutton Qorma | مٹن قورمہ | قورمة غنم |
| Curry | Chicken Achari | چکن اچاری | دجاج أتشاري |
| Curry | Mutton Achari | مٹن اچاری | غنم أتشاري |
| Curry | White Mutton Qorma | وائٹ مٹن قورمہ | قورمة غنم بيضاء |
| Curry | Kabab Karahi | کباب کڑاہی | كباب كراهي |
| Rice | Mutton Palao | مٹن پلاؤ | أرز بلاو باللحم |
| Rice | Chicken Biryani | چکن بریانی | برياني دجاج |
| Rice | Daal Chawal | دال چاول | دال مع الأرز |
| Special Lunch & Dinner | Chicken Handi | چکن ہانڈی | هاندي دجاج |
| Special Lunch & Dinner | Mutton Handi | مٹن ہانڈی | هاندي غنم |
| Special Lunch & Dinner | Mutton Fresh White Karahi | مٹن فریش وائٹ کڑاہی | كراهي غنم بيضاء طازجة |
| Special Lunch & Dinner | Chicken Fresh White Karahi | چکن فریش وائٹ کڑاہی | كراهي دجاج بيضاء طازجة |
| Special Lunch & Dinner | Mutton Fresh Karahi | مٹن فریش کڑاہی | كراهي غنم طازجة |
| Special Lunch & Dinner | Chicken Fresh Karahi | چکن فریش کڑاہی | كراهي دجاج طازجة |
| Refreshment | Samosa Chaat | سموسہ چاٹ | تشات السمبوسة |
| Refreshment | Chana Chaat | چنا چاٹ | تشات الحمص |
| Refreshment | Samosa + Raita | سموسہ اور رائتہ | سمبوسة مع الريتة |
| Refreshment | Pakora (1kg) | پکوڑے (ایک کلو) | باكورا (كيلو) |
| Refreshment | Jalebi (1kg) | جلیبی (ایک کلو) | جليبي (كيلو) |
| Refreshment | Kheer | کھیر | كهير أرز بالحليب |
| Refreshment | Milk Jalebi | دودھ جلیبی | جليبي بالحليب |
| Refreshment | Fresh Lassi | تازہ لسی | لسي طازج |
| Refreshment | Rabri Milk | ربڑی دودھ | ربري بالحليب |
