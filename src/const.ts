// export const monthsContractsDefault: Array<MonthContract> = [
// 	{
// 		month: "Enero",
// 		cant: 0,
// 	},
// 	{
// 		month: "Febrero",
// 		cant: 0,
// 	},
// 	{
// 		month: "Marzo",
// 		cant: 0,
// 	},
// 	{
// 		month: "Abril",
// 		cant: 0,
// 	},
// 	{
// 		month: "Mayo",
// 		cant: 0,
// 	},
// 	{
// 		month: "Junio",
// 		cant: 0,
// 	},
// 	{
// 		month: "Julio",
// 		cant: 0,
// 	},
// 	{
// 		month: "Agosto",
// 		cant: 0,
// 	},
// 	{
// 		month: "Septiembre",
// 		cant: 0,
// 	},
// 	{
// 		month: "Octubre",
// 		cant: 0,
// 	},
// 	{
// 		month: "Noviembre",
// 		cant: 0,
// 	},
// 	{
// 		month: "Diciembre",
// 		cant: 0,
// 	},
// ];

// export const Months = {
// 	Enero: "enero",
// 	Febrero: "febrero",
// 	Marzo: "marzo",
// 	Abril: "abril",
// 	Mayo: "mayo",
// 	Junio: "junio",
// 	Julio: "julio",
// 	Agosto: "agosto",
// 	Septiembre: "septiembre",
// 	Octubre: "octubre",
// 	Noviembre: "noviembre",
// 	Diciembre: "diciembre",
// };

// export const enumMonth = Object.values(Months).map(
// 	(s: string) => s.charAt(0).toUpperCase() + s.slice(1),
// );
// const Provinces = {
// 	AbraDeCaiguanab: "abra de caiguanab",
// 	AguaDulce: "agua dulce",
// 	AguasClaras: "aguas claras",
// 	Ahocinado: "ahocinado",
// 	AlonsoRojas: "alonso rojas",
// 	America: "américa",
// 	ArroyosDeMantua: "arroyos de mantua",
// 	BahiaHonda: "bahía honda",
// 	BlancaArena: "blanca arena",
// 	CayoLargo: "cayo largo",
// 	CiudadSandino: "ciudad sandino",
// 	Coloma: "coloma",
// 	ConsolacionDelNorte: "consolación del norte",
// 	ConsolaciónDelSur: "consolación del sur",
// 	Cortes: "cortés",
// 	Dimas: "dimas",
// 	Guane: "guane",
// 	JoseMarti: "josé martí",
// 	LaPalma: "la palma",
// 	LosPalacios: "los palacios",
// 	Mantua: "mantua",
// 	MinasDeMatahambre: "minas de matahambre",
// 	Ovas: "ovas",
// 	Pilotos: "pilotos",
// 	PinarDelRio: "pinar del río",
// 	PuertaDeGolpe: "puerta de golpe",
// 	SanCristóbal: "san cristóbal",
// 	SanDiegoDeLosBaños: "san diego de los baños",
// 	Sandino: "sandino",
// 	SanJuanYMartínez: "san juan y martínez",
// 	SanJulian: "san julián",
// 	SanLuis: "san luis",
// 	SantaCruzDeLosPinos: "santa cruz de los pinos",
// 	Villamil: "villamil",
// 	Viñales: "viñales",
// };

export enum UserRole {
	SPECIALIST = "SPECIALIST",
	HEAD_OF_DEPARTMENT = "HEAD_OF_DEPARTMENT",
}

export enum RequestStatus {
	PENDING = "pending",
	APPROVED = "approved",
	DENIED = "denied",
}

export enum Routes {
	auth = "/auth",
	user = "/user",
	product = "/product",
	departament = "/departament",
	destiny = "/destiny",
	request = "/request",
	province = "/province",
	states = "/state",
	ccosto = "/ccosto",
}
