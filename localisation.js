// all the text shown by index.html (hw1) and index2.html (hw2), in English and Italian
const LOC = {
en: {
  hw1: {
    title: 'HW1 - elliptic curve',
    dl: 'download',
    h1: 'HW1 - private key k -> public key Q = kG',
    rnd: 'random G',
    run: 'run',
    delay: 'delay',
    legend: 'grey: points of the curve, blue: the two points being added, small light blue: the line through them (mod p), orange: third point on the line, red: the result (third point reflected), black: multiples already computed',
    curveNote: 'Modulo p the curve is the set of grey points. The rule is the same as over the real numbers (the line through P and Q meets the curve in a third point, and its reflection is P + Q), but the curve no longer looks continuous and the line wraps around the grid.',
    statsH: 'statistics over all multiples kG, k = 1 .. n-1',
    notesH: 'notes',
    notes: `<p>With the default values (the ones in the assignment) the curve has 18 points, G = (1, 5) has order 9 and Q = 6G = (5, 8).
Computing kG is fast: double-and-add needs about log2(k) doublings and a few additions. Going back from Q to k has no known shortcut:
here brute force needs at most 8 tries, on secp256k1 n is about 2^256 and the best known attack (Pollard rho) still needs about 2^128 steps.
This is what makes kG a one-way function.</p>
<p>With p = 17 there are too few points for the statistics. Try p = 991 or p = 9739 with a random G: there the number of points is prime (1009 and 9631),
so every point except O generates the whole group, as on secp256k1 (cofactor 1).</p>
<p>Results:</p>
<ul>
<li>only about half of the x values appear, since x^3 + ax + b must be a square mod p. Each x appears twice, for kG and (n-k)G = -kG,
so the plot of x against k is symmetric around n/2 even if it looks random.</li>
<li>with a = 0 and p = 1 mod 3 (991, 9739 and also the p of secp256k1) each y appears three times, because x -> cx with c^3 = 1 does not change x^3.
So there are only n/3 different y values and the y histogram is less flat.</li>
<li>for larger p the x histogram is close to flat (chi2 close to the number of bins), about half of the bits are 1 except the highest one (p is not a power of 2),
and flipping one bit of k changes about half of the bits of x, close to the red binomial curve.</li>
<li>corr(k, x) and corr(x, y) are always 0, but this comes from the symmetry above, not from randomness. The map is fully structured: aG + bG = (a + b)G.</li>
<li>a different G of the same group only changes the order of the points: the histograms stay the same, only the plots against k change.</li>
</ul>
<p>For a one-way function what matters is that kG is easy and deterministic to compute and that k cannot be recovered from Q.
There must be no usable correlation between k and Q, because any pattern would help to find k, but looking random is not enough:
the small curve looks just as random and is broken in 8 tries.
Uniform output bits, avalanche effect, collision resistance, fixed output size for any input and no algebraic structure are properties of hash functions.
kG does not need them: it has no collisions at all (k -> kG is a bijection for k = 1 .. n-1), and its structure is used on purpose by signatures and by BIP-32 public derivation.
This is also why Ethereum hashes the public key with Keccak-256 before using it as an address (HW2).</p>`,
    curve: (N, G, n) => `the curve has ${N} points (with O), G = ${G} has order n = ${n}`,
    key: k => `private key k = ${k}`,
    many: ' (too many additions, using double-and-add)',
    pub: (k, Q) => `PUBLIC KEY  Q = ${k}G = ${Q}`,
    brute: (jG, j, n) => `brute force: G, 2G, 3G, ... reaches Q at ${jG}, so k = ${j} (mod ${n}), never more than ${n - 1} tries`,
    zero: n => `Q = O is the point at infinity (the neutral element, it has no coordinates): k is a multiple of the order n = ${n} of G.
A valid private key must be between 1 and n - 1, so choose another k or a G with a larger order.`,
    canvasQ: (kG, Q) => `public key Q = ${kG} = ${Q}`,
    canvasO: kG => `public key Q = ${kG} = O, point at infinity (not on the grid)`,
    errInt: 'p, a, b and k must be integers',
    errPrime: 'p must be a prime between 3 and 99999',
    errSing: '4a^3 + 27b^2 = 0 (mod p), the curve is singular',
    errG: G => `G = ${G} is not on the curve`,
    errK: 'k must be at least 1',
    few: n => `n = ${n}, too few points`,
    s1: 'x of kG against k',
    s2: 'histogram of x',
    s3: 'histogram of y',
    s4: B => `share of 1s, bits 0..${B - 1} of x`,
    s5: 'bits of x changed (1 bit of k flipped)',
    stPoints: (m, dx, dy) => `${m} points, ${dx} different x, ${dy} different y`,
    stChi: (nb, x, y) => `chi2 against uniform, ${nb} bins (about ${nb - 1} if uniform): x ${x}, y ${y}`,
    stCorr: 'correlation',
    stOnes: (x, y) => `1 bits: x ${x}%, y ${y}%`,
    stFlip: (m, B) => `flipping 1 bit of k changes ${m} of ${B} bits of x on average`
  },
  hw2: {
    title: 'HW2 - mnemonic to address',
    dl: 'download',
    h1: 'HW2 - mnemonic -> seed -> private key -> public key -> Ethereum address',
    mn: 'mnemonic',
    pw: 'passphrase',
    path: 'path',
    derive: 'derive',
    statsH: 'statistics',
    statsIntro: 'addresses of the private keys k, k+1, ..., k+N-1 (k = the key above), N =',
    run: 'run',
    notesH: 'notes',
    notes: `<p>The default phrase is the BIP-39 test vector (entropy all zeros). Imported in MetaMask or Rabby it gives the same first account, 0x9858EfFD232B4033E47d90003D41EC34EcaEda94.
The phrase is public, use it only for tests.</p>
<p>BIP-39 (2013). This is the only step where something is generated: 128 random bits (256 for 24 words) plus a checksum of 4 bits (8 for 24 words), taken from the first bits of SHA-256(entropy),
split into groups of 11 bits, each one mapped to a word from a list of 2048. So it is an encoding with a checksum: easy to write on paper, and a wrong word is usually detected.
Then the phrase, as text, goes through PBKDF2-HMAC-SHA512 with 2048 rounds and salt "mnemonic" + passphrase, which gives the 512 bit seed.
A different passphrase gives a completely different wallet.</p>
<p>BIP-32 (2012). Key derivation. HMAC-SHA512 with key "Bitcoin seed" splits the seed into a master private key and a chain code.
Each child is HMAC-SHA512(chain code, parent key || index): the left half is added to the parent private key mod n, the right half becomes the new chain code.
Hardened levels (') use the parent private key, the others use the parent public key, so an extended public key (public key + chain code) can derive the child public keys
without any private key. This works only because aG + bG = (a + b)G.</p>
<p>BIP-44 (2014). A naming rule for the tree: m / purpose' / coin' / account' / change / index, with coin 60 for Ether. Since all wallets follow it, the same phrase gives the same accounts in every wallet.</p>
<p>secp256k1. Public key cryptography: Q = kG on y^2 = x^3 + 7 modulo a 256 bit prime, with the same code as HW1 but using BigInt. Easy in one direction, ECDLP in the other.
It is the only step with a key pair, and it is what makes signatures work: anyone can check with Q that a transaction was signed with k.</p>
<p>Keccak-256. Hashing: the 64 bytes of the public key become 32 bytes, and the address is the last 20. The output has fixed size and looks uniform,
the structure of the point is lost and Q cannot be recovered from the address.</p>
<p>EIP-55 (2016). A checksum stored in the letter case. Hex digits are case insensitive, so every letter can carry one bit: it is uppercase if the hex digit at the same position of Keccak-256(lowercase address) is 8 or more.
Old software still reads the address, new software detects typos. It protects against mistakes, not against attacks.</p>
<p>In short: key generation = new randomness, only once (the entropy of the mnemonic, from a secure random generator).
Key derivation = deterministic functions of what already exists (seed, BIP-32 keys, public key, address): same input, same output, so the phrase is the only backup needed.
Public key cryptography = secp256k1, a key pair with algebraic structure, used for signatures.
Hashing = SHA-256, SHA-512 (inside HMAC and PBKDF2) and Keccak-256: one-way, fixed size, no structure.
Checksums = the last bits of the mnemonic and the letter case of EIP-55, they only detect errors.
Encoding = words for bits, hex for bytes, mixed case: reversible, no security at all.</p>
<p>Statistics: entropy, seed, keys, hashes and addresses should all look like uniform random bits, and the results above agree: about 50% ones, flat hex digits,
consecutive private keys give addresses that differ in about 80 of 160 bits, and flipping one input bit changes about 128 of the 256 bits of Keccak-256
(the red curves show what an ideal random function gives). The structure of the curve, Q(k+1) = Q(k) + G, is not visible after the hash.
The checksums are the non-random part, by design: 4 fixed bits in the mnemonic, and about 15 letters per address in EIP-55 (40 digits, 6 of 16 are letters),
so a mistyped address passes the check with probability (13/16)^40, about 0.025%.</p>
<p>Timeline<br>
1977 RSA, public key cryptography<br>
2001 SHA-2 (SHA-256, SHA-512)<br>
2012 BIP-32, Keccak wins the SHA-3 competition<br>
2013 BIP-39<br>
2014 BIP-44, the Ethereum yellow paper uses Keccak-256<br>
2015 SHA-3 standard (FIPS 202) with a different padding, Ethereum goes live in July and keeps the original Keccak<br>
2016 EIP-55</p>
<p>SHA-2 and Keccak/SHA-3 are both hash families but they are built differently. SHA-2 uses the Merkle-Damgård construction like MD5 and SHA-1: a compression function applied block after block.
Keccak is a sponge: a 1600 bit state and a fixed permutation, the input is absorbed 1088 bits at a time (256 bit version) and the other 512 bits, the capacity, are never output.
NIST did not choose it because SHA-2 was broken, but to have a backup with a different design. Keccak-256 and SHA3-256 use the same permutation, rate and output size;
FIPS 202 only changed the padding (domain separation byte 0x06 instead of 0x01), and the outputs are completely different (see the empty string above).</p>
<p>Why not one algorithm for everything: each step needs something the others cannot provide. A hash cannot produce a public key that others can use to verify a signature,
an elliptic curve point has structure on purpose and is not a short uniform identifier, and none of them can be written on paper and checked by a person.
So BIP-39/32/44 handle key management (one readable backup, any number of keys, same paths in every wallet), secp256k1 gives the private/public key pair and signatures,
Keccak-256 turns the public key into a fixed size address, and EIP-55 catches typos.</p>`,
    empty: 'the mnemonic is empty',
    badPath: "the path should look like m/44'/60'/0'/0/0",
    error: 'error: ',
    s39: 'mnemonic -> BIP-39',
    pbkdf: 'PBKDF2-HMAC-SHA512(mnemonic, "mnemonic" + passphrase, 2048 rounds)',
    s32: 'seed -> BIP-32 / BIP-44, one HMAC-SHA512 per level',
    sSecp: 'private key -> secp256k1, Q = kG',
    priv: 'private',
    pub: 'public',
    sKeccak: 'public key -> Keccak-256 of the 64 bytes (x, y)',
    addr: 'address',
    last20: '(last 20 bytes)',
    sEip: 'address -> EIP-55',
    sha3: '(same code, padding byte 0x06 instead of 0x01)',
    c1: 'hex digits in the addresses',
    c2: 'bits changed, address(k) vs (k+1)',
    c3: 'Keccak-256, 1 input bit flipped',
    stOnes: (n, p) => `${n} addresses, ${p}% of the bits are 1`,
    stChi: c => `hex digits: chi2 = ${c} (15 degrees of freedom, about 15 if uniform)`,
    stCons: m => `consecutive keys: ${m} of 160 address bits change on average`,
    stAval: m => `Keccak-256, 1 of 512 input bits flipped: ${m} of 256 output bits change on average`
  }
},
it: {
  hw1: {
    title: 'HW1 - curva ellittica',
    dl: 'scarica',
    h1: 'HW1 - chiave privata k -> chiave pubblica Q = kG',
    rnd: 'G casuale',
    run: 'esegui',
    delay: 'ritardo',
    legend: 'grigio: punti della curva, blu: i due punti da sommare, azzurro piccolo: la retta che li unisce (mod p), arancione: terzo punto sulla retta, rosso: il risultato (terzo punto riflesso), nero: multipli già calcolati',
    curveNote: `Modulo p la curva è l'insieme dei punti grigi. La regola è la stessa dei numeri reali (la retta per P e Q incontra la curva in un terzo punto, e il suo simmetrico è P + Q), ma la curva non sembra più continua e la retta si avvolge sulla griglia.`,
    statsH: 'statistiche su tutti i multipli kG, k = 1 .. n-1',
    notesH: 'note',
    notes: `<p>Con i valori di default (quelli della traccia) la curva ha 18 punti, G = (1, 5) ha ordine 9 e Q = 6G = (5, 8).
Calcolare kG è veloce: double-and-add richiede circa log2(k) raddoppi e qualche somma. Per tornare da Q a k non si conosce una scorciatoia:
qui la forza bruta richiede al massimo 8 tentativi, su secp256k1 n vale circa 2^256 e il miglior attacco noto (Pollard rho) richiede comunque circa 2^128 passi.
È questo che rende kG una funzione one-way.</p>
<p>Con p = 17 i punti sono troppo pochi per le statistiche. Conviene provare p = 991 o p = 9739 con un G casuale: in questi casi il numero di punti è primo (1009 e 9631),
quindi ogni punto tranne O genera tutto il gruppo, come su secp256k1 (cofattore 1).</p>
<p>Risultati:</p>
<ul>
<li>compare solo circa metà dei valori di x, perché x^3 + ax + b deve essere un quadrato mod p. Ogni x compare due volte, per kG e per (n-k)G = -kG,
quindi il grafico di x in funzione di k è simmetrico rispetto a n/2 anche se sembra casuale.</li>
<li>con a = 0 e p = 1 mod 3 (991, 9739 e anche il p di secp256k1) ogni y compare tre volte, perché x -> cx con c^3 = 1 non cambia x^3.
Quindi ci sono solo n/3 valori diversi di y e l'istogramma di y è meno piatto.</li>
<li>per p più grandi l'istogramma di x è quasi piatto (chi2 vicino al numero di classi), circa metà dei bit vale 1 tranne il più alto (p non è una potenza di 2),
e invertendo un bit di k cambia circa metà dei bit di x, in accordo con la curva binomiale rossa.</li>
<li>corr(k, x) e corr(x, y) valgono sempre 0, ma per la simmetria descritta sopra e non per casualità. La funzione è del tutto strutturata: aG + bG = (a + b)G.</li>
<li>un altro G dello stesso gruppo cambia solo l'ordine dei punti: gli istogrammi restano uguali, cambiano solo i grafici in funzione di k.</li>
</ul>
<p>Per una funzione one-way conta che kG sia facile da calcolare e deterministico, e che non si possa ricavare k da Q.
Non deve esserci una correlazione sfruttabile tra k e Q, perché qualsiasi regolarità aiuterebbe a trovare k, ma sembrare casuale non basta:
la curva piccola sembra altrettanto casuale e si rompe in 8 tentativi.
Bit di output uniformi, effetto valanga, resistenza alle collisioni, output di lunghezza fissa per qualsiasi input e assenza di struttura algebrica sono proprietà delle funzioni hash.
kG non ne ha bisogno: non ha collisioni (k -> kG è una biiezione per k = 1 .. n-1), e la sua struttura viene usata di proposito dalle firme digitali e dalla derivazione pubblica di BIP-32.
Per questo Ethereum applica Keccak-256 alla chiave pubblica prima di usarla come indirizzo (HW2).</p>`,
    curve: (N, G, n) => `la curva ha ${N} punti (con O), G = ${G} ha ordine n = ${n}`,
    key: k => `chiave privata k = ${k}`,
    many: ' (troppe somme, uso double-and-add)',
    pub: (k, Q) => `CHIAVE PUBBLICA  Q = ${k}G = ${Q}`,
    brute: (jG, j, n) => `forza bruta: G, 2G, 3G, ... arriva a Q con ${jG}, quindi k = ${j} (mod ${n}), mai più di ${n - 1} tentativi`,
    zero: n => `Q = O è il punto all'infinito (l'elemento neutro, non ha coordinate): k è un multiplo dell'ordine n = ${n} di G.
Una chiave privata valida deve stare tra 1 e n - 1, quindi scegli un altro k o un G con ordine più grande.`,
    canvasQ: (kG, Q) => `chiave pubblica Q = ${kG} = ${Q}`,
    canvasO: kG => `chiave pubblica Q = ${kG} = O, punto all'infinito (fuori dalla griglia)`,
    errInt: 'p, a, b e k devono essere interi',
    errPrime: 'p deve essere un primo tra 3 e 99999',
    errSing: '4a^3 + 27b^2 = 0 (mod p), la curva è singolare',
    errG: G => `G = ${G} non sta sulla curva`,
    errK: 'k deve essere almeno 1',
    few: n => `n = ${n}, troppo pochi punti`,
    s1: 'x di kG in funzione di k',
    s2: 'istogramma di x',
    s3: 'istogramma di y',
    s4: B => `frazione di 1, bit 0..${B - 1} di x`,
    s5: 'bit di x cambiati (1 bit di k invertito)',
    stPoints: (m, dx, dy) => `${m} punti, ${dx} valori diversi di x, ${dy} valori diversi di y`,
    stChi: (nb, x, y) => `chi2 rispetto alla distribuzione uniforme, ${nb} classi (circa ${nb - 1} se uniforme): x ${x}, y ${y}`,
    stCorr: 'correlazione',
    stOnes: (x, y) => `bit a 1: x ${x}%, y ${y}%`,
    stFlip: (m, B) => `invertendo 1 bit di k cambiano in media ${m} bit di x su ${B}`
  },
  hw2: {
    title: "HW2 - dalla frase mnemonica all'indirizzo",
    dl: 'scarica',
    h1: 'HW2 - frase mnemonica -> seed -> chiave privata -> chiave pubblica -> indirizzo Ethereum',
    mn: 'frase mnemonica',
    pw: 'passphrase',
    path: 'percorso',
    derive: 'deriva',
    statsH: 'statistiche',
    statsIntro: 'indirizzi delle chiavi private k, k+1, ..., k+N-1 (k = la chiave sopra), N =',
    run: 'esegui',
    notesH: 'note',
    notes: `<p>La frase di default è il test vector di BIP-39 (entropia tutta a zero). Importata in MetaMask o Rabby dà lo stesso primo account, 0x9858EfFD232B4033E47d90003D41EC34EcaEda94.
La frase è pubblica, va usata solo per test.</p>
<p>BIP-39 (2013). È l'unico passaggio in cui si genera qualcosa: 128 bit casuali (256 per 24 parole) più un checksum di 4 bit (8 per 24 parole), presi dai primi bit di SHA-256(entropia),
divisi in gruppi da 11 bit, ognuno associato a una parola di una lista di 2048. Quindi è una codifica con checksum: facile da scrivere su carta, e una parola sbagliata di solito viene rilevata.
Poi la frase, come testo, passa per PBKDF2-HMAC-SHA512 con 2048 iterazioni e salt "mnemonic" + passphrase, e si ottiene il seed da 512 bit.
Con una passphrase diversa si ottiene un wallet completamente diverso.</p>
<p>BIP-32 (2012). Derivazione delle chiavi. HMAC-SHA512 con chiave "Bitcoin seed" divide il seed in una chiave privata master e un chain code.
Ogni figlio è HMAC-SHA512(chain code, chiave del padre || indice): la metà sinistra viene sommata alla chiave privata del padre mod n, la metà destra diventa il nuovo chain code.
I livelli hardened (') usano la chiave privata del padre, gli altri la chiave pubblica, quindi una chiave pubblica estesa (chiave pubblica + chain code) può derivare le chiavi pubbliche dei figli
senza conoscere nessuna chiave privata. Funziona solo perché aG + bG = (a + b)G.</p>
<p>BIP-44 (2014). Una regola per dare un nome ai rami dell'albero: m / purpose' / coin' / account' / change / index, con coin 60 per Ether. Dato che tutti i wallet la seguono, la stessa frase dà gli stessi account in ogni wallet.</p>
<p>secp256k1. Crittografia a chiave pubblica: Q = kG su y^2 = x^3 + 7 modulo un primo da 256 bit, con lo stesso codice dell'HW1 ma usando BigInt. Facile in una direzione, ECDLP nell'altra.
È l'unico passaggio con una coppia di chiavi, ed è ciò che fa funzionare le firme: chiunque può verificare con Q che una transazione è stata firmata con k.</p>
<p>Keccak-256. Hashing: i 64 byte della chiave pubblica diventano 32 byte, e l'indirizzo sono gli ultimi 20. L'output ha lunghezza fissa e sembra uniforme,
la struttura del punto si perde e Q non si può ricavare dall'indirizzo.</p>
<p>EIP-55 (2016). Un checksum codificato nelle maiuscole e minuscole. Le cifre esadecimali non distinguono maiuscole e minuscole, quindi ogni lettera può portare un bit: è maiuscola se la cifra esadecimale nella stessa posizione di Keccak-256(indirizzo in minuscolo) vale 8 o più.
I software vecchi leggono comunque l'indirizzo, quelli nuovi rilevano gli errori di battitura. Protegge dagli errori, non dagli attacchi.</p>
<p>In sintesi: generazione delle chiavi = nuova casualità, una sola volta (l'entropia della frase, da un generatore casuale sicuro).
Derivazione delle chiavi = funzioni deterministiche di ciò che esiste già (seed, chiavi BIP-32, chiave pubblica, indirizzo): stesso input, stesso output, quindi la frase è l'unico backup necessario.
Crittografia a chiave pubblica = secp256k1, una coppia di chiavi con struttura algebrica, usata per le firme.
Hashing = SHA-256, SHA-512 (dentro HMAC e PBKDF2) e Keccak-256: one-way, lunghezza fissa, nessuna struttura.
Checksum = gli ultimi bit della frase e le maiuscole di EIP-55, servono solo a rilevare errori.
Codifica = parole per i bit, esadecimale per i byte, maiuscole e minuscole: reversibile, nessuna sicurezza.</p>
<p>Statistiche: entropia, seed, chiavi, hash e indirizzi dovrebbero sembrare tutti bit casuali uniformi, e i risultati sopra lo confermano: circa 50% di bit a 1, cifre esadecimali distribuite in modo uniforme,
chiavi private consecutive danno indirizzi che differiscono in circa 80 bit su 160, e invertendo un bit di input cambiano circa 128 dei 256 bit di Keccak-256
(le curve rosse mostrano cosa darebbe una funzione casuale ideale). La struttura della curva, Q(k+1) = Q(k) + G, dopo l'hash non si vede più.
I checksum sono la parte non casuale, per costruzione: 4 bit fissi nella frase e circa 15 lettere per indirizzo in EIP-55 (40 cifre, 6 su 16 sono lettere),
quindi un indirizzo con un errore di battitura supera il controllo con probabilità (13/16)^40, circa 0,025%.</p>
<p>Cronologia<br>
1977 RSA, crittografia a chiave pubblica<br>
2001 SHA-2 (SHA-256, SHA-512)<br>
2012 BIP-32, Keccak vince la competizione SHA-3<br>
2013 BIP-39<br>
2014 BIP-44, lo yellow paper di Ethereum usa Keccak-256<br>
2015 standard SHA-3 (FIPS 202) con un padding diverso, Ethereum parte a luglio e mantiene il Keccak originale<br>
2016 EIP-55</p>
<p>SHA-2 e Keccak/SHA-3 sono entrambe famiglie di funzioni hash, ma costruite in modo diverso. SHA-2 usa la costruzione di Merkle-Damgård come MD5 e SHA-1: una funzione di compressione applicata un blocco dopo l'altro.
Keccak è una sponge: uno stato da 1600 bit e una permutazione fissa, l'input viene assorbito 1088 bit alla volta (versione a 256 bit) e gli altri 512 bit, la capacity, non vengono mai dati in output.
Il NIST non l'ha scelto perché SHA-2 fosse rotto, ma per avere un'alternativa con un design diverso. Keccak-256 e SHA3-256 usano la stessa permutazione, lo stesso rate e la stessa lunghezza di output;
FIPS 202 ha cambiato solo il padding (byte di domain separation 0x06 invece di 0x01), e gli output sono completamente diversi (vedi la stringa vuota sopra).</p>
<p>Perché non un solo algoritmo per tutto: ogni passaggio richiede qualcosa che gli altri non possono dare. Un hash non può produrre una chiave pubblica con cui altri verificano una firma,
un punto della curva ha di proposito una struttura e non è un identificatore corto e uniforme, e nessuno dei due si può scrivere su carta e controllare a mano.
Quindi BIP-39/32/44 gestiscono le chiavi (un backup leggibile, quante chiavi si vuole, gli stessi percorsi in ogni wallet), secp256k1 dà la coppia chiave privata/pubblica e le firme,
Keccak-256 trasforma la chiave pubblica in un indirizzo di lunghezza fissa, ed EIP-55 rileva gli errori di battitura.</p>`,
    empty: 'la frase mnemonica è vuota',
    badPath: "il percorso deve essere del tipo m/44'/60'/0'/0/0",
    error: 'errore: ',
    s39: 'frase mnemonica -> BIP-39',
    pbkdf: 'PBKDF2-HMAC-SHA512(frase, "mnemonic" + passphrase, 2048 iterazioni)',
    s32: 'seed -> BIP-32 / BIP-44, un HMAC-SHA512 per livello',
    sSecp: 'chiave privata -> secp256k1, Q = kG',
    priv: 'privata',
    pub: 'pubblica',
    sKeccak: 'chiave pubblica -> Keccak-256 dei 64 byte (x, y)',
    addr: 'indirizzo',
    last20: '(ultimi 20 byte)',
    sEip: 'indirizzo -> EIP-55',
    sha3: '(stesso codice, byte di padding 0x06 invece di 0x01)',
    c1: 'cifre esadecimali negli indirizzi',
    c2: 'bit cambiati, indirizzo(k) e (k+1)',
    c3: 'Keccak-256, 1 bit di input invertito',
    stOnes: (n, p) => `${n} indirizzi, ${p}% dei bit vale 1`,
    stChi: c => `cifre esadecimali: chi2 = ${c} (15 gradi di libertà, circa 15 se uniforme)`,
    stCons: m => `chiavi consecutive: in media cambiano ${m} bit dell'indirizzo su 160`,
    stAval: m => `Keccak-256, 1 dei 512 bit di input invertito: in media cambiano ${m} bit di output su 256`
  }
}
}
