let arrkey = ["umum","olahraga","sains","kesehatan","teknologi","bisnis"]
if (!localStorage.getItem('databerita')){
	const tmpdataberita = JSON.stringify({
		'umum': JSON.stringify(dataidgenerals),
		'olahraga': JSON.stringify(dataidsports),
		'sains': JSON.stringify(dataidsains),
		'kesehatan': JSON.stringify(dataidhealth),
		'teknologi': JSON.stringify(dataidtechnology),
		'bisnis': JSON.stringify(dataidbusiness),
	})
	localStorage.setItem('databerita', tmpdataberita)
}

const databerita = JSON.parse(localStorage.getItem('databerita'))

const getdata = apa => {
	let datanow = null
	if (Object.keys(databerita).indexOf(apa) < 0) apa = 'umum'; // Tidak ditemukan, set ke general
	datanow = databerita[apa];
	return datanow
}

const potongStr = (strnya, berapa=50) => {
	if(strnya.length < berapa) return strnya;
	return `${strnya.slice(0, berapa)}...`
}


// -- FORM EDIT -- \\

const formEdit = isi => {
	const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
	let param = params.berita
	let idx = params.idx

	let tmpdata = null
	let articles = null
	try {
		tmpdata = JSON.parse(databerita[param])
		articles = tmpdata.articles[idx]
		if (!articles) throw 'News Not Found!!'
	} catch(e) {
		console.log(e)
		alert(e)
		return
	}
	console.log(articles)

	if (isi === 'set'){
		$("#imgedit").attr('src', articles.urlToImage)
		$("#titleedit").val(articles.title)
		$("#descedit").val(articles.description)
	}
	if (isi === 'edit'){
		console.log(articles, 'arBefore')
		articles.title = $("#titleedit").val()
		articles.description = $("#descedit").val()
		tmpdata.articles[idx] = articles
		databerita[param] = JSON.stringify(tmpdata)

		localStorage.setItem('databerita', JSON.stringify(databerita))
		console.log(tmpdata, 'ar')
		alert("Success EDIT")
		document.location.href = `detail-berita.html?berita=${param}&idx=${idx}`

	}
	if (isi === 'detail'){
		$('#imgdetail').attr('src', articles.urlToImage)
		$('#titledetail').text(articles.title)
		$('#descdetail').text(articles.description)
		let person = articles.author
		let date = articles.publishedAt.split("T").join(' ').substring(0, articles.publishedAt.split("T").join(' ').length - 1) || '-'
		$('#persondate').text(`-- ${person} --- ${date} --`)
	}
}