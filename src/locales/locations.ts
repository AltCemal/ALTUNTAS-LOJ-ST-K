type Lang = 'tr' | 'en' | 'de'

type Locations = {
  turkeyCities: string[]
  europeCountries: string[]
}

const tr: Locations = {
  turkeyCities: [
    'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul','İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale','Kırklareli','Kırşehir','Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak'
  ],
  europeCountries: [
    'Almanya','Arnavutluk','Avusturya','Belçika','Beyaz Rusya','Bosna-Hersek','Bulgaristan','Çek Cumhuriyeti','Danimarka','Estonya','Finlandiya','Fransa','Gürcistan','Hırvatistan','Hollanda','İngiltere','İrlanda','İspanya','İsveç','İsviçre','İtalya','İzlanda','Karadağ','Kıbrıs','Kosova','Letonya','Liechtenstein','Litvanya','Lüksemburg','Macaristan','Malta','Makedonya','Moldova','Norveç','Polonya','Portekiz','Romanya','Rusya','Sırbistan','Slovakya','Slovenya','Ukrayna','Yunanistan','Andorra','Monako'
  ]
}

const en: Locations = {
  turkeyCities: [
    'Adana','Adiyaman','Afyonkarahisar','Agri','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin','Aydin','Balikesir','Bartin','Batman','Bayburt','Bilecik','Bingol','Bitlis','Bolu','Burdur','Bursa','Canakkale','Cankiri','Corum','Denizli','Diyarbakir','Duzce','Edirne','Elazig','Erzincan','Erzurum','Eskisehir','Gaziantep','Giresun','Gumushane','Hakkari','Hatay','Igdir','Isparta','Istanbul','Izmir','Kahramanmaras','Karabuk','Karaman','Kars','Kastamonu','Kayseri','Kirikkale','Kirklareli','Kirsehir','Kilis','Kocaeli','Konya','Kutahya','Malatya','Manisa','Mardin','Mersin','Mugla','Mus','Nevsehir','Nigde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Sanliurfa','Sirnak','Tekirdag','Tokat','Trabzon','Tunceli','Usak','Van','Yalova','Yozgat','Zonguldak'
  ],
  europeCountries: [
    'Germany','Albania','Austria','Belgium','Belarus','Bosnia and Herzegovina','Bulgaria','Czech Republic','Denmark','Estonia','Finland','France','Georgia','Croatia','Netherlands','United Kingdom','Ireland','Spain','Sweden','Switzerland','Italy','Iceland','Montenegro','Cyprus','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Hungary','Malta','North Macedonia','Moldova','Norway','Poland','Portugal','Romania','Russia','Serbia','Slovakia','Slovenia','Ukraine','Greece','Andorra','Monaco'
  ]
}

const de: Locations = {
  turkeyCities: [...en.turkeyCities],
  europeCountries: [
    'Deutschland','Albanien','Oesterreich','Belgien','Belarus','Bosnien und Herzegowina','Bulgarien','Tschechische Republik','Daenemark','Estland','Finnland','Frankreich','Georgien','Kroatien','Niederlande','Vereinigtes Koenigreich','Irland','Spanien','Schweden','Schweiz','Italien','Island','Montenegro','Zypern','Kosovo','Lettland','Liechtenstein','Litauen','Luxemburg','Ungarn','Malta','Nordmazedonien','Moldau','Norwegen','Polen','Portugal','Rumaenien','Russland','Serbien','Slowakei','Slowenien','Ukraine','Griechenland','Andorra','Monaco'
  ]
}

export const locations: Record<Lang, Locations> = { tr, en, de }
