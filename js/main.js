let arrkey = ["umum","olahraga","sains","kesehatan","teknologi","bisnis"]
if (!localStorage.getItem('databerita')){ // Jika beritanya belum dimasukin ke LocalStorage Browser
	const tmpdataberita = JSON.stringify({
		'umum': JSON.stringify(dataidgenerals),
		'olahraga': JSON.stringify(dataidsports),
		'sains': JSON.stringify(dataidsains),
		'kesehatan': JSON.stringify(dataidhealth),
		'teknologi': JSON.stringify(dataidtechnology),
		'bisnis': JSON.stringify(dataidbusiness),
	})
	localStorage.setItem('databerita', tmpdataberita) // set dulu beritanya dari datanya.json
}

const databerita = JSON.parse(localStorage.getItem('databerita'))

const getdata = apa => {
	let datanow = null
	if (Object.keys(databerita).indexOf(apa) < 0) apa = 'umum'; // Tidak ditemukan, set ke berita general
	datanow = databerita[apa];
	return datanow
}

const potongStr = (strnya, berapa=50) => { // Potong text yg ada di judul klo lebih panjang dari 50
	if(strnya.length < berapa) return strnya;
	return `${strnya.slice(0, berapa)}...`
}


// -- FORM EDIT -- \\

const formEdit = isi => {
	const params = Object.fromEntries(new URLSearchParams(window.location.search).entries()); // ambil param URL atas
	let param = params.berita
	let idx = params.idx

	let tmpdata = null
	let articles = null
	try {
		tmpdata = JSON.parse(databerita[param])
		articles = tmpdata.articles[idx]
		if (!articles) throw 'News Not Found!!' // jika index data tidak ditemukan munculkan error not found
	} catch(e) {
		console.log(e)
		alert(e)
		return
	}
	console.log(articles)

	if (isi === 'set'){ // jika mode adalah set ke form
		$("#imgedit").attr('src', articles.urlToImage)
		$("#titleedit").val(articles.title)
		$("#descedit").val(articles.description)
	}
	if (isi === 'edit'){ // jika mode adalah edit data berita dengan isian dari form
		console.log(articles, 'arBefore')
		let valtitle = $("#titleedit").val()
		let valdesc = $("#descedit").val()
		// if (valtitle === '' || valdesc === '')
		if ([valtitle, valdesc].indexOf('') > -1){ // Perform Validation jika form title dan description kosong, tolak!
			alert('Title dan Deskripsi TIdak boleh kosong!!')
			return
		}

		// Melakukan set data ke LocalStorage Browser
		articles.title = valtitle
		articles.description = valdesc
		tmpdata.articles[idx] = articles
		databerita[param] = JSON.stringify(tmpdata)

		localStorage.setItem('databerita', JSON.stringify(databerita))
		console.log(tmpdata, 'ar')
		alert("Success EDIT") // tampilkan pesan sukses
		// redirect ke detail untuk melihat hasil yang sudah di edit
		document.location.href = `detail-berita.html?berita=${param}&idx=${idx}`

	}
	if (isi === 'detail'){ // jika mode show detail
		$('#imgdetail').attr('src', articles.urlToImage)
		$('#titledetail').text(articles.title)
		$('#descdetail').text(articles.description)
		let person = articles.author
		let tmpdate = articles.publishedAt.split("T").join(' ')
		let date = tmpdate.substring(0, tmpdate.length - 1) || '-'
		$('#persondate').text(`-- ${person} --- ${date} --`)
	}
}