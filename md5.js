// MD5 Hashing function
module.exports.MD5 = function MD5(string) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
	}
	function AddUnsigned(lX, lY) {
		let lSW = (lX & 0xffff) + (lY & 0xffff)
		let lZ = (lX >>> 16) + (lY >>> 16) + (lSW >>> 16)
		return ((lZ & 0xffff) << 16) | (lSW & 0xffff)
	}
	function F(x, y, z) {
		return (x & y) | (~x & z)
	}
	function G(x, y, z) {
		return (x & z) | (y & ~z)
	}
	function H(x, y, z) {
		return x ^ y ^ z
	}
	function I(x, y, z) {
		return y ^ (x | ~z)
	}
	function FF(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac))
		return AddUnsigned(RotateLeft(a, s), b)
	}
	function GG(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac))
		return AddUnsigned(RotateLeft(a, s), b)
	}
	function HH(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac))
		return AddUnsigned(RotateLeft(a, s), b)
	}
	function II(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac))
		return AddUnsigned(RotateLeft(a, s), b)
	}
	function ConvertToWordArray(string) {
		let lWordCount
		let lMessageLength = string.length
		let lNumberOfWordsTempOne = lMessageLength + 8
		let lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64
		let lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16
		let lWordArray = Array(lNumberOfWords - 1)
		let lBytePosition = 0
		let lByteCount = 0
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4
			lBytePosition = (lByteCount % 4) * 8
			lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition)
			lByteCount++
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4
		lBytePosition = (lByteCount % 4) * 8
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
		return lWordArray
	}
	function WordToHex(lValue) {
		let WordToHexValue = ''
		let WordToHexValueTemp = ''
		let lByte
		let lCount
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255
			WordToHexValueTemp = '0' + lByte.toString(16)
			WordToHexValue = WordToHexValue + WordToHexValueTemp.substring(WordToHexValueTemp.length - 2, WordToHexValueTemp.length)
		}
		return WordToHexValue
	}
	let x = []
	let k, AA, BB, CC, DD, a, b, c, d
	let S11 = 7,
		S12 = 12,
		S13 = 17,
		S14 = 22
	let S21 = 5,
		S22 = 9,
		S23 = 14,
		S24 = 20
	let S31 = 4,
		S32 = 11,
		S33 = 16,
		S34 = 23
	let S41 = 6,
		S42 = 10,
		S43 = 15,
		S44 = 21
	string = String(string)
	x = ConvertToWordArray(string)
	a = 0x67452301
	b = 0xefcdab89
	c = 0x98badcfe
	d = 0x10325476
	for (k = 0; k < x.length; k += 16) {
		AA = a
		BB = b
		CC = c
		DD = d
		a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478)
		d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756)
		c = FF(c, d, a, b, x[k + 2], S13, 0x242070db)
		b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee)
		a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf)
		d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a)
		c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613)
		b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501)
		a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8)
		d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af)
		c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1)
		b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be)
		a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122)
		d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193)
		c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e)
		b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821)
		a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562)
		d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340)
		c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51)
		b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa)
		a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d)
		d = GG(d, a, b, c, x[k + 10], S22, 0x02441453)
		c = GG(c, d, a, b, x[k + 15], S23, 0xd8ef04b8)
		b = GG(b, c, d, a, x[k + 4], S24, 0x18913809)
		a = GG(a, b, c, d, x[k + 9], S21, 0x56801f34)
		d = GG(d, a, b, c, x[k + 14], S22, 0x64e0793a)
		c = GG(c, d, a, b, x[k + 3], S23, 0x20e1c652)
		b = GG(b, c, d, a, x[k + 8], S24, 0x78e3ee4)
		a = GG(a, b, c, d, x[k + 13], S21, 0x183115c)
		d = GG(d, a, b, c, x[k + 2], S22, 0xfd387e25)
		c = GG(c, d, a, b, x[k + 7], S23, 0xfc9c6b71)
		b = GG(b, c, d, a, x[k + 12], S24, 0x676f02d9)
		a = HH(a, b, c, d, x[k + 5], S31, 0x8d2a4c8a)
		d = HH(d, a, b, c, x[k + 8], S32, 0xfffa3942)
		c = HH(c, d, a, b, x[k + 11], S33, 0x8771f681)
		b = HH(b, c, d, a, x[k + 14], S34, 0x6d9d6122)
		a = HH(a, b, c, d, x[k + 1], S31, 0xfde5380c)
		d = HH(d, a, b, c, x[k + 4], S32, 0xa4beea44)
		c = HH(c, d, a, b, x[k + 7], S33, 0x4bdecfa9)
		b = HH(b, c, d, a, x[k + 10], S34, 0xf6bb4b60)
		a = HH(a, b, c, d, x[k + 13], S31, 0xbebfbc70)
		d = HH(d, a, b, c, x[k + 0], S32, 0x289b7ec6)
		c = HH(c, d, a, b, x[k + 3], S33, 0xeaa127fa)
		b = HH(b, c, d, a, x[k + 6], S34, 0xd4ef3085)
		a = HH(a, b, c, d, x[k + 9], S31, 0x4881d05)
		d = HH(d, a, b, c, x[k + 12], S32, 0xd9d4d039)
		c = HH(c, d, a, b, x[k + 15], S33, 0xe6db99e5)
		b = HH(b, c, d, a, x[k + 2], S34, 0x1fa27cf8)
		a = II(a, b, c, d, x[k + 0], S41, 0xc4ac5665)
		d = II(d, a, b, c, x[k + 7], S42, 0xf4292244)
		c = II(c, d, a, b, x[k + 14], S43, 0x432aff97)
		b = II(b, c, d, a, x[k + 5], S44, 0xab9423a7)
		a = II(a, b, c, d, x[k + 12], S41, 0xfc93a039)
		d = II(d, a, b, c, x[k + 3], S42, 0x655b59c3)
		c = II(c, d, a, b, x[k + 10], S43, 0x8f0ccc92)
		b = II(b, c, d, a, x[k + 1], S44, 0xffeff47d)
		a = II(a, b, c, d, x[k + 8], S41, 0x85845dd1)
		d = II(d, a, b, c, x[k + 15], S42, 0x6fa87e4f)
		c = II(c, d, a, b, x[k + 6], S43, 0xfe2ce6e0)
		b = II(b, c, d, a, x[k + 13], S44, 0xa3014314)
		a = II(a, b, c, d, x[k + 4], S41, 0x4e0811a1)
		d = II(d, a, b, c, x[k + 11], S42, 0xf7537e82)
		c = II(c, d, a, b, x[k + 2], S43, 0xbd3af235)
		b = II(b, c, d, a, x[k + 9], S44, 0x2ad7d2bb)
		a = AddUnsigned(a, AA)
		b = AddUnsigned(b, BB)
		c = AddUnsigned(c, CC)
		d = AddUnsigned(d, DD)
	}
	let temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)
	return temp.toLowerCase()
}