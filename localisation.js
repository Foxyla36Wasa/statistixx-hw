// all the text shown by index.html (hw1) and index2.html (hw2), in English and Italian
const LOC = {
en: {
  hw1: {
    title: 'HW1 - elliptic curve',
    dl: 'download',
    h1: 'HW1 - private key k -> public key Q = kG',
    rnd: 'random G',
    run: 'run',
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
  },
  hw2b: {
    title: 'HW2-B - EC encryption and Caesar',
    dl: 'download',
    h1: 'HW2-B - elliptic-curve encryption and the Caesar cipher, and how both are broken',
    msg: 'message',
    msgNote: 'only the letters A-Z are encrypted, everything else is left as it is',
    hEc: '1. elliptic-curve encryption on secp256k1 (ElGamal style)',
    dKey: 'private key d =',
    dNote: '(kept small on purpose, see part 5), key space 2^',
    pubKey: 'public key Q = dG',
    encrypt: 'encrypt',
    encNote: '(a new random ephemeral r is drawn every time)',
    hCaesar: '2. Caesar cipher',
    kKey: 'key k =',
    kNote: '(shift, 0 to 25)',
    hFreq: '3. letter frequencies',
    freqNote: 'black: the text, red line: English. Caesar only moves the shape of the plaintext distribution, the EC scheme makes it flat.',
    hCrack: '4. breaking the Caesar cipher with statistics',
    useFirst: 'use the first',
    useFirst2: 'letters of the Caesar ciphertext.',
    method: 'method',
    mChi: 'letter frequency (chi-square)',
    mBg: 'bigram score',
    mEx: 'exhaustive (show all 26)',
    run: 'run',
    howMany: 'how many letters are needed: for each length, the fraction of random samples of the ciphertext where each method returns the real key',
    hAttack: '5. breaking the EC scheme through the small key space',
    mBf: 'brute force (try d = 1, 2, 3, ...)',
    mBsgs: 'baby-step giant-step (about the square root of the key space)',
    attack: 'attack',
    notesH: 'notes',
    notes: `<p>The default private key is d = 50123 in a key space of 2^16, the default Caesar key is k = 7.
Both ciphers shift the letters A-Z and leave everything else unchanged. Caesar adds the same number to every letter,
the EC scheme adds a different number to each letter, taken from a keystream that only the two key holders can compute.</p>
<p>1. The EC scheme works like ElGamal (a simplified ECIES) on the real secp256k1 curve, with the same point arithmetic in BigInt as HW2.
The private key is a number d, the public key is the point Q = dG. Only d has to stay secret, Q can be published.
Here d is kept small on purpose, so that the attack in part 5 can run.
<br>To encrypt, which needs only Q: draw a random ephemeral r, send R = rG in clear and compute the shared secret S = rQ = r(dG) = (rd)G.
The x coordinate of S is the seed of the keystream that is added to the letters.
<br>To decrypt, which needs d: compute S = dR = d(rG) = (rd)G from the received R. It is the same point, so the seed and the keystream are the same,
and the keystream is subtracted instead of added.
<br>Everyone sees G, Q and R, but only d or r gives S, and finding d from Q means solving the elliptic-curve discrete logarithm.
A new r is drawn for every message, so encrypting the same text twice gives a different R and a different ciphertext (press encrypt twice to see it).</p>
<p>2. The Caesar cipher is c = (m + k) mod 26 with one key k between 0 and 25, and decryption subtracts k. The whole message uses the same key.</p>
<p>3. Similarities and differences. Both schemes add a shift to each letter mod 26 and decrypt by subtracting it, so letter by letter the two procedures are the same.
<br>The keys work differently. Caesar is symmetric: the same k encrypts and decrypts, so it must stay secret on both sides.
The EC scheme is asymmetric: anyone can encrypt with the public Q, only the owner of d can decrypt.
<br>The key spaces are very different. Caesar has 26 keys, 25 of them useful. The EC private key can be any number in [1, n) with n about 2^256,
and the ephemeral r changes the whole sequence of shifts at every message.
<br>The histograms show the statistical difference. Caesar applies one shift, so the ciphertext keeps the English letter distribution rotated by k:
the bars keep their shape and only move sideways. The EC keystream applies an almost random shift at every position, so it behaves like a
polyalphabetic cipher: the output is almost flat and does not match the English line anywhere.
A flat distribution removes exactly the information a frequency attack needs.</p>
<p>4. The attack on Caesar tries all 26 shifts and gives each decryption a score against English.
Chi-square compares the letter counts of the decryption with the English frequencies, and the real key gives the smallest chi-square (drawn as the tallest bar).
Bigram scoring adds up the frequency of each pair of consecutive letters, which carries much more structure than single letters.
Exhaustive search only prints the 26 candidates and leaves the choice to a person.
<br>Both reference tables come from a corpus. For single letters the standard English frequencies are used: a table built from the 537 thousand letters
of Pride and Prejudice gives the same results within the measurement noise, so a larger corpus does not help there.
For bigrams the corpus matters: the full 26 x 26 table of pair frequencies from the same book, quantized to 62 levels and stored as a 676 character string in the code,
works much better than a short hand-written list of common pairs. Measured on texts not used to build it (Moby Dick and Alice in Wonderland),
the recovery rate goes from about 50% to 71% at 5 letters, from 68% to 91% at 8 letters and from 83% to 98% at 12 letters.
Twenty thousand letters of corpus already give the same quality as half a million.
<br>The second plot shows how much text is needed. On the default message (403 letters, 400 random samples per length) chi-square finds the key
in 35% of the cases with 3 letters, 47% with 5, 69% with 8, 88% with 12, 96% with 20 and always from about 30 letters.
The bigram score is better on short texts: 52% with 3 letters, 66% with 5, 91% with 8, 98% with 12 and always from 20. Random guessing would give 1/26, about 4%.
Chi-square needs more text because a short sample does not yet have the letter distribution of English, while the bigram table recognises pairs like QU or TH in a few letters.
The attack also assumes ordinary English text: a text made of one repeated letter, a pangram or a text in another language can defeat it.
In any case Caesar is never secure, because the 26 keys can always be tried by hand: the statistics only choose the readable one automatically.</p>
<p>5. The weakness of the EC scheme is not the curve but the small range of d, so the key can be searched.
Brute force tries d = 1, 2, 3, ..., one point addition each, until dG equals Q. Measured in Chrome on the PC used for this homework, each addition takes about 20 microseconds,
so the default d = 50123 is found in about 1 second and a key space of 2^18 in at most 5 seconds, while 2^20 would take about 20 seconds: for this reason the page limits brute force to 2^18.
Baby-step giant-step does the same search in about 2 sqrt(key space) steps using a table: about 10 ms for 2^16, 60 ms for 2^21 and less than 3 seconds for 2^32,
so it reaches much larger key spaces. Once d is known, the message is decrypted with it.
<br>The two attacks are different in nature. Breaking Caesar is statistical inference: it reads a pattern that the plaintext left in the ciphertext,
and needs enough text for that pattern to appear. Breaking the EC scheme is a key search: it ignores the ciphertext and only tests keys against the public Q,
which is why it works even though the EC ciphertext is statistically flat. A flat output hides the plaintext, not the key.
One attack exploits a non-uniform plaintext, the other a small key space.
<br>With a properly configured curve neither attack scales. With d anywhere in [1, 2^256) brute force needs about 2^256 additions,
and baby-step giant-step about 2^128 steps and 2^128 points of memory. Pollard rho, the best generic attack, also costs about 2^128 steps but with almost no memory,
still far out of reach. The method stays the same, only the size of the space changes, and the discrete logarithm stays hard.
This is why real secp256k1 keys use the whole range.
<br>Finally, which weakness comes from where. Brute force and baby-step giant-step come only from the restricted key space, and a full-size d removes them.
The design of the scheme has separate problems that a longer key would not fix. The keystream is a simple linear congruential generator, so it is predictable,
and it is seeded with only 64 bits of x(S), so there are at most 2^64 keystreams whatever the size of d.
There is no MAC, so a ciphertext can be modified without being noticed, and reducing the shared point to a mod 26 stream throws away almost all of it.
A real ECIES solves these with a proper key derivation function, a real cipher and a MAC, independently of the key length.</p>`,
    errD: 'd must be a whole number of at least 1',
    ephem: 'ephemeral r',
    ephemNote: '(random, discarded after encryption)',
    sent: 'sent with the ciphertext',
    shared: 'shared secret',
    ct: 'ciphertext',
    dec: 'decrypt',
    usesD: '(uses d)',
    usesK: '(uses k)',
    f1: 'plaintext',
    f2: 'Caesar ciphertext',
    f3: 'EC ciphertext',
    chiTitle: L => `English fit of each shift with chi-square (tallest = guessed key), ${L} letters`,
    bgTitle: L => `bigram score of each shift (tallest = guessed key), ${L} letters`,
    exHead: 'all 26 shifts, pick the readable one:',
    guessed: k => `guessed key k = ${k}`,
    ok: '  (correct)',
    wrong: k => `  (wrong, real k = ${k})`,
    plain: 'plaintext',
    cmp: (a, b, k) => `chi-square: k = ${a},  bigram: k = ${b},  real k = ${k}`,
    sucTitle: n => `fraction of ${n} random samples where the key is recovered`,
    chiName: 'chi-square',
    bgName: 'bigram',
    letters: 'letters',
    space: (B, b) => `key space 2^${B} = ${b}`,
    tooBf: 'too large for brute force in the browser (limit 2^18), use baby-step giant-step',
    tooBs: 'too large to run in the browser (limit 2^32), see the notes on Pollard rho',
    running: 'running...',
    notFound: B => `not found below 2^${B} (the real d is larger than the key space you set)`,
    found: d => `recovered private key d = ${d}`,
    matches: '  (matches)',
    tookBf: (ms, d) => `took ${ms} ms, about ${d} point additions`,
    tookBs: (ms, s, b) => `took ${ms} ms, about ${s} steps instead of ${b}`,
    decWith: 'decrypted with the recovered d:'
  },
  hw3: {
    title: 'HW3 - penetration score, LLN and CLT',
    dl: 'download',
    h1: 'HW3 - n systems, m attackers and the aggregate penetration score',
    intro: 'Each attacker goes through the n systems one at a time and collects a score X at each step. The m attackers are independent, so the m trajectories are m samples of the same random walk.',
    modelL: 'model',
    optB: 'Bernoulli, X in {0,1}, P(X=1) = p',
    optR: 'Rademacher, X in {-1,+1}, p = 1/2',
    run: 'run',
    hTraj: '1. trajectories',
    viewL: 'view',
    first: 'draw the first',
    first2: 'attackers, red: theoretical mean and plus or minus one standard deviation',
    hDist: '2. distribution of the three quantities at the final n',
    distNote: 'black: the m attackers, red: the normal density predicted by the central limit theorem',
    hLln: '3. law of large numbers',
    lln1: 'fraction of attackers with |S_n/n - mean| > e, for e =',
    lln2: ', compared with the Chebyshev bound',
    hVar: '4. variance under the three normalizations',
    varNote: 'log scale, dots: measured over the m attackers, lines: theory',
    hClt: '5. central limit theorem',
    cltNote: 'standardized score (S_n - n*mean) / (sd*sqrt(n)) compared with the standard normal, and the largest gap between the two cumulative distributions',
    notesH: 'notes',
    notes: `<p>The defaults are the Bernoulli model with p = 0.3, n = 1000 systems and m = 2000 attackers.
Every chart is built from the m simulated trajectories when the page runs, nothing is precomputed.
The three quantities are recorded at 44 values of n spaced on a log scale between 1 and the final n, so every chart against n shows the behaviour for increasing n in a single run.</p>
<p>The model. An attacker goes through the systems in order and at system i collects the score X_i.
In the Bernoulli model X_i = 1 means that the system was penetrated and p is the success rate per system, so S_n counts how many of the n systems were compromised.
The Rademacher model gives +1 for a success and -1 for a failure with equal probability. Its step mean is zero,
and it represents the symmetric case with no drift at all.
The m attackers do not interact, so m does not change the process: it is the number of samples used to see its distribution.</p>
<p>The three views in section 1 summarise the behaviour. S_n spreads out like a fan whose width grows like sqrt(n) around the line n times the step mean.
S_n/n is the same data divided by n, and the fan collapses onto the step mean. S_n/sqrt(n) divides by just enough to keep the fan at a constant width.
The red curves are the theoretical mean and plus or minus one standard deviation.</p>
<p>Law of large numbers. S_n/n converges in probability to the step mean, p for Bernoulli and 0 for Rademacher.
Section 3 shows it directly: the fraction of attackers whose average is further than e from the mean goes to zero as n grows.
Chebyshev's inequality gives the bound variance / (n e^2), drawn in red. The measured fraction stays below it and falls much faster,
because Chebyshev uses only the variance while the real tail is close to normal and decays exponentially.</p>
<p>Variance. A single step has variance s^2, which is p(1-p) for Bernoulli and 1 for Rademacher.
The steps are independent, so the variances add: Var(S_n) = n s^2, Var(S_n/n) = s^2 / n and Var(S_n/sqrt(n)) = s^2.
On the log scale of section 4 these are a rising line, a falling line and a flat line, and the measured points lie on them.
This is why the three normalizations behave so differently: dividing by n is too strong and removes the fluctuation,
not dividing lets it grow without limit, and dividing by sqrt(n) is the only choice that keeps it finite and non-zero.</p>
<p>Central limit theorem. For Rademacher the step mean is 0 and the step variance is 1, so S_n/sqrt(n) is already standardized
and converges in distribution to N(0,1) without any change. For Bernoulli the same quantity has mean sqrt(n) p,
which grows without limit, so S_n/sqrt(n) does not converge and the normal limit appears only after centering,
as (S_n - n p) / sqrt(n p (1-p)). Section 5 compares this standardized score with the standard normal.</p>
<p>The largest gap between the two cumulative distributions does not go to zero in the plot, for two reasons.
S_n takes values on a lattice (integers for Bernoulli, integers two apart for Rademacher), so its cumulative distribution is a staircase
while the normal one is smooth. Near the centre each step of the staircase is about 0.4 times the lattice spacing after standardizing,
and the normal curve can at best pass through the middle of a step, so the gap cannot go below half a step:
about 0.4/sqrt(n) for Rademacher, the red curve in the chart.
The second limit, the blue line, is the gap that a sample of m points drawn from an exact normal would still show, about 0.87/sqrt(m).
Convergence in distribution holds and the two cumulative distributions meet in the limit,
but a finite n and a finite m each leave a visible trace, and the measured gap follows the larger of the two.</p>
<p>How n and m act. They have different roles. n is the size of the attack surface and drives the mathematics:
the concentration of S_n/n, the sqrt(n) growth of the fluctuations and the approach to the normal shape.
For a single attacker m does not change anything, it only sets how precisely the process can be measured.
The +- printed next to each number is the Monte Carlo error due to m, about s/sqrt(m) for a mean
and about sqrt(2/m) in relative terms for a variance. With m = 2000 a measured variance can be a few percent away from the theory
without anything being wrong, which is why the two values are printed side by side. A suitable m is one that makes this error
small compared to the effect being studied: increasing m makes the histograms smoother and lowers the blue line,
while increasing n is what makes the three normalizations behave differently.</p>
<p>In security terms. The expected number of compromised systems is n p and grows with the size of the organization,
so a larger organization loses more machines in absolute terms. The compromise rate S_n/n settles at p whatever the size,
so the fraction of systems that fall depends on the defence of each system and not on how many systems there are.
What changes with n is predictability: the relative spread of the rate is s / (p sqrt(n)) and shrinks,
so a large organization loses a very predictable fraction, while for a small one the result depends much more on chance, in both directions.
<br>The number of attackers matters when their results are combined, and the last two lines of the output show the two ways.
All m attackers together have a total score with mean m n p, which grows with both m and n.
The best of the m attackers ends about sqrt(2 ln m) standard deviations above the mean (slightly less for small m), so its advantage grows only slowly with m,
but for a defender it is usually this best attacker, not the average one, that decides the outcome.
<br>The symmetric Rademacher case represents a defence that wins as often as it loses: the expected net score is zero,
but the actual score still moves away from zero like sqrt(n), so even a balanced situation produces large absolute imbalances on a large number of systems.</p>`,
    errP: 'p must be strictly between 0 and 1',
    errBig: 'n times m is too large for the browser, reduce n or m',
    head: (model, mu, v, n, m) => `${model},  step mean = ${mu},  step variance = ${v},  n = ${n},  m = ${m}`,
    mcNote: 'the +- is the Monte Carlo error expected from m attackers, not a property of the process',
    mean: 'mean',
    theory: 'theory',
    variance: 'variance',
    total: (m, v, e, s) => `all m = ${m} attackers together: total score ${v}  (theory m*n*mean = ${e}, standard deviation ${s})`,
    best: (b, z, ez) => `best attacker: S_n = ${b}, ${z} standard deviations above the mean  (about ${ez} expected for the best of m)`,
    trajTitle: q => `${q} against the number of systems`,
    llnTitle: e => `P(|S_n/n - mean| > ${e})`,
    measured: 'measured',
    cheb: 'Chebyshev bound',
    varTitle: 'variance of the three quantities',
    vS: 'Var(S_n) grows like n',
    vA: 'Var(S_n/n) falls like 1/n',
    vQ: 'Var(S_n/sqrt(n)) is flat',
    cltTitle: 'standardized S_n against N(0,1)',
    ksTitle: 'largest gap to the normal CDF',
    ksGrid: 'floor from the lattice spacing of S_n',
    ksSamp: 'level expected from m samples alone',
    gap: (n, v) => `largest gap at n = ${n}: ${v}`,
    floors: 'the gap cannot go below the larger of two floors, and the measured points follow the one that dominates',
    latt: (v, s) => `  lattice floor at this n ${v}, because S_n only takes values ${s} apart and the normal is continuous`,
    samp: v => `  sampling level 0.87/sqrt(m) = ${v}, the gap that an exactly normal sample of this size would still show`,
    rad: 'S_n/sqrt(n) already has mean 0 and variance 1, so it converges to N(0,1) with no further centering',
    ber: 'S_n/sqrt(n) has mean sqrt(n)*p, which grows, so the standard normal limit needs the centering above'
  },
  hw4: {
    title: 'HW4 - Welford and sampling mean and variance',
    dl: 'download',
    h1: "HW4 - Welford's recurrence formulas, sampling mean and sampling variance",
    hEx1: "Ex. 1 - Welford's recurrence formulas",
    deriv: `<p>Knuth's recurrence for the mean. Let M_k be the mean of the first k values. Since k M_k = (k-1) M_(k-1) + x_k,</p>
<pre>M_k = M_(k-1) + (x_k - M_(k-1)) / k</pre>
<p>The new mean is the old one corrected by a fraction 1/k of the error d_k = x_k - M_(k-1) that the old mean makes on the new value.</p>
<p>Sum of squares. The same approach is applied to SS_k = sum_(i=1..k) (x_i - M_k)^2 = sum_(i=1..k) x_i^2 - k M_k^2.
Subtracting the same expression for k-1:</p>
<pre>SS_k - SS_(k-1) = x_k^2 - k M_k^2 + (k-1) M_(k-1)^2</pre>
<p>Now write x_k = M_(k-1) + d_k and M_k = M_(k-1) + d_k / k and expand. All the terms that contain M_(k-1) cancel and only d_k^2 - d_k^2 / k remains.
Since x_k - M_k = d_k (k-1) / k, the result can be written with the two errors, before and after updating the mean:</p>
<pre>SS_k = SS_(k-1) + (x_k - M_(k-1)) (x_k - M_k)       SS_1 = 0</pre>
<p>Variance. The sample variance is s_k^2 = SS_k / (k-1) for k >= 2. Dividing the recurrence by k-1 gives the recurrence for the variance:</p>
<pre>s_k^2 = (k-2)/(k-1) s_(k-1)^2 + d_k^2 / k</pre>
<p>Code. For each new value x, with k counting from 1, the core logic is a few lines:</p>`,
    codeNote: 'Ex. 2 uses this code for every hacker, and below it can be tried on any list of numbers.',
    dataL: 'numbers',
    calc: 'compute',
    errData: 'enter at least two numbers',
    hEx2: 'Ex. 2 - sampling mean and variance',
    intro: "m hackers each attack n systems and get one score between 0 and 10 for each system. The default score is the number of successful steps out of 10, each successful with probability p, so it is binomial(10, p) with mu = 10p and sigma^2 = 10p(1-p); the menu also offers a uniform score on {0, ..., 10} and a continuous score 10 Beta(2, 5). For every hacker Welford's recurrence gives the sampling mean and the sampling variance of the n scores.",
    distL: 'score distribution',
    optB: 'binomial(10, p)',
    optU: 'uniform on {0, ..., 10}',
    optBe: '10 Beta(2, 5)',
    nB: p => `binomial(10, ${p})`,
    nU: 'uniform {0, ..., 10}',
    nBe: '10 Beta(2, 5)',
    run: 'run',
    hAvg: '1. averages over the m hackers against n',
    avgNote: 'black: average of the sampling means (top) and of the sampling variances (bottom), red: mu and sigma^2',
    hVar: '2. variability of the estimates against n',
    varNote: 'log scale, dots: variance across the m hackers, lines: theory, sigma^2/n for the means and mu4/n - sigma^4 (n-3)/(n(n-1)) for the variances (mu4 = fourth central moment)',
    notesH: 'notes',
    notes: `<p>Conclusions. With the default values (p = 0.3, so mu = 3 and sigma^2 = 2.1) the average of the sampling means is 3.0005 and the average
of the sampling variances is 2.1015, both within the Monte Carlo error printed next to them.
Section 1 repeats the comparison for 40 values of n between 2 and 1000, and the agreement holds for every n, even for n = 2 (2.154 +- 0.065 against 2.1).
The same holds for the other two distributions in the menu: 5.0029 against mu = 5 and 9.9977 against sigma^2 = 10 for the uniform score,
2.8588 against 2.8571 and 2.5532 against 2.5510 for 10 Beta(2, 5).
So the sample mean and the sample variance computed with n - 1 are unbiased estimators: E[mean] = mu and E[s^2] = sigma^2.</p>
<p>Use in inferential statistics. In practice mu and sigma^2 are unknown and only one sample is available.
Since the sample mean and the sample variance are unbiased, and their variance goes to zero as n grows (section 2),
they can be used to estimate the population parameters from a single sample.
This is the basis of inference: the standard error sigma/sqrt(n) of a mean is estimated as s/sqrt(n),
and with it one builds confidence intervals such as mean +- 1.96 s/sqrt(n) and tests such as the t test.</p>
<p>Effect of n on the variability. Section 2 shows that the variance of the sampling means follows sigma^2/n:
with the default values it goes from 1.02 at n = 2 to 0.0021 at n = 1000, so four times more systems halve the standard deviation of a hacker's mean.
The variance of the sampling variances, mu4/n - sigma^4 (n-3)/(n(n-1)), also falls like 1/n: from 8.83 at n = 2 to 0.0083 at n = 1000.
Increasing the number of systems attempted by each hacker therefore makes both estimates more precise.</p>`,
    errP: 'p must be strictly between 0 and 1',
    errBig: 'n times m is too large for the browser (limit 1e7), reduce n or m',
    head: (name, mu, s2, n, m) => `${name},  mu = ${mu},  sigma^2 = ${s2},  n = ${n},  m = ${m}`,
    mcNote: 'the +- is the Monte Carlo error expected from m hackers, not a property of the estimators',
    measured: 'measured',
    theory: 'theory',
    rMean: 'average of the sampling means',
    rVar: 'average of the sampling variances',
    pmTitle: 'average of the sampling means',
    pvTitle: 'average of the sampling variances',
    vvTitle: 'variance of the estimates across the hackers',
    vMeans: 'Var(sampling mean)',
    vVars: 'Var(sampling variance)'
  }
},
it: {
  hw1: {
    title: 'HW1 - curva ellittica',
    dl: 'scarica',
    h1: 'HW1 - chiave privata k -> chiave pubblica Q = kG',
    rnd: 'G casuale',
    run: 'esegui',
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
  },
  hw2b: {
    title: 'HW2-B - cifratura EC e Cesare',
    dl: 'scarica',
    h1: 'HW2-B - cifratura su curva ellittica e cifrario di Cesare, e come si rompono',
    msg: 'messaggio',
    msgNote: 'vengono cifrate solo le lettere A-Z, tutto il resto resta com\'è',
    hEc: '1. cifratura su curva ellittica secp256k1 (stile ElGamal)',
    dKey: 'chiave privata d =',
    dNote: '(tenuta piccola di proposito, vedi parte 5), spazio delle chiavi 2^',
    pubKey: 'chiave pubblica Q = dG',
    encrypt: 'cifra',
    encNote: '(ogni volta viene estratto un nuovo r effimero casuale)',
    hCaesar: '2. cifrario di Cesare',
    kKey: 'chiave k =',
    kNote: '(shift, da 0 a 25)',
    hFreq: '3. frequenza delle lettere',
    freqNote: 'nero: il testo, linea rossa: l\'inglese. Cesare sposta soltanto la forma della distribuzione del testo in chiaro, lo schema EC la rende piatta.',
    hCrack: '4. rompere il cifrario di Cesare con la statistica',
    useFirst: 'usa le prime',
    useFirst2: 'lettere del cifrato di Cesare.',
    method: 'metodo',
    mChi: 'frequenza delle lettere (chi-quadro)',
    mBg: 'punteggio dei bigrammi',
    mEx: 'ricerca esaustiva (mostra tutti i 26)',
    run: 'esegui',
    howMany: 'quante lettere servono: per ogni lunghezza, la frazione di campioni casuali del cifrato in cui ciascun metodo trova la chiave reale',
    hAttack: '5. rompere lo schema EC sfruttando lo spazio delle chiavi ridotto',
    mBf: 'forza bruta (prova d = 1, 2, 3, ...)',
    mBsgs: 'baby-step giant-step (circa la radice quadrata dello spazio delle chiavi)',
    attack: 'attacca',
    notesH: 'note',
    notes: `<p>La chiave privata di default è d = 50123 in uno spazio delle chiavi di 2^16, la chiave di Cesare di default è k = 7.
Entrambi i cifrari spostano le lettere A-Z e lasciano invariato tutto il resto. Cesare somma lo stesso numero a ogni lettera,
lo schema EC somma un numero diverso a ogni lettera, preso da un keystream che solo chi ha le chiavi può calcolare.</p>
<p>1. Lo schema EC funziona come ElGamal (un ECIES semplificato) sulla vera curva secp256k1, con la stessa aritmetica dei punti in BigInt dell'HW2.
La chiave privata è un numero d, la chiave pubblica è il punto Q = dG. Solo d deve restare segreta, Q si può pubblicare.
Qui d è tenuta piccola di proposito, perché l'attacco della parte 5 possa funzionare.
<br>Per cifrare, e basta Q: si estrae un r effimero casuale, si invia R = rG in chiaro e si calcola il segreto condiviso S = rQ = r(dG) = (rd)G.
La coordinata x di S è il seed del keystream che viene sommato alle lettere.
<br>Per decifrare serve d: dal R ricevuto si calcola S = dR = d(rG) = (rd)G. È lo stesso punto, quindi seed e keystream sono gli stessi,
e il keystream viene sottratto invece che sommato.
<br>Tutti vedono G, Q e R, ma solo d o r permettono di ottenere S, e ricavare d da Q significa risolvere il logaritmo discreto su curva ellittica.
Per ogni messaggio si estrae un nuovo r, quindi cifrando due volte lo stesso testo si ottengono un R e un cifrato diversi (premi due volte cifra per vederlo).</p>
<p>2. Il cifrario di Cesare è c = (m + k) mod 26 con una sola chiave k tra 0 e 25, e per decifrare si sottrae k. Tutto il messaggio usa la stessa chiave.</p>
<p>3. Somiglianze e differenze. Entrambi gli schemi sommano uno shift a ogni lettera mod 26 e decifrano sottraendolo, quindi lettera per lettera le due procedure sono uguali.
<br>Le chiavi funzionano in modo diverso. Cesare è simmetrico: la stessa k cifra e decifra, quindi deve restare segreta da entrambe le parti.
Lo schema EC è asimmetrico: chiunque può cifrare con la Q pubblica, solo chi possiede d può decifrare.
<br>Gli spazi delle chiavi sono molto diversi. Cesare ha 26 chiavi, di cui 25 utili. La chiave privata EC può essere qualsiasi numero in [1, n) con n circa 2^256,
e l'r effimero cambia l'intera sequenza di shift a ogni messaggio.
<br>Gli istogrammi mostrano la differenza statistica. Cesare applica un solo shift, quindi il cifrato conserva la distribuzione delle lettere dell'inglese ruotata di k:
le barre mantengono la loro forma e si spostano soltanto di lato. Il keystream EC applica uno shift quasi casuale a ogni posizione, quindi si comporta come un
cifrario polialfabetico: l'output è quasi piatto e non coincide in nessun punto con la linea dell'inglese.
Una distribuzione piatta toglie proprio l'informazione di cui ha bisogno un attacco basato sulle frequenze.</p>
<p>4. L'attacco a Cesare prova tutti i 26 shift e dà a ogni decifratura un punteggio rispetto all'inglese.
Il chi-quadro confronta i conteggi delle lettere della decifratura con le frequenze dell'inglese, e la chiave giusta dà il chi-quadro più piccolo (disegnato come la barra più alta).
Il punteggio dei bigrammi somma la frequenza di ogni coppia di lettere consecutive, che contiene molta più struttura delle lettere singole.
La ricerca esaustiva stampa soltanto i 26 candidati e lascia la scelta a una persona.
<br>Entrambe le tabelle di riferimento vengono da un corpus. Per le lettere singole si usano le frequenze standard dell'inglese: una tabella costruita sui 537 mila caratteri
di Pride and Prejudice dà gli stessi risultati entro il rumore della misura, quindi un corpus più grande lì non aiuta.
Per i bigrammi invece il corpus conta: la tabella completa 26 x 26 delle frequenze delle coppie dello stesso libro, quantizzata su 62 livelli e salvata come stringa di 676 caratteri nel codice,
funziona molto meglio di una breve lista di coppie comuni scritta a mano. Misurata su testi non usati per costruirla (Moby Dick e Alice nel paese delle meraviglie),
la percentuale di successo passa da circa 50% a 71% con 5 lettere, da 68% a 91% con 8 lettere e da 83% a 98% con 12 lettere.
Ventimila caratteri di corpus danno già la stessa qualità di mezzo milione.
<br>Il secondo grafico mostra quanto testo serve. Sul messaggio di default (403 lettere, 400 campioni casuali per lunghezza) il chi-quadro trova la chiave
nel 35% dei casi con 3 lettere, 47% con 5, 69% con 8, 88% con 12, 96% con 20 e sempre da circa 30 lettere in su.
Il punteggio dei bigrammi è migliore sui testi corti: 52% con 3 lettere, 66% con 5, 91% con 8, 98% con 12 e sempre da 20 in su. Tirando a caso si otterrebbe 1/26, circa il 4%.
Il chi-quadro ha bisogno di più testo perché un campione corto non ha ancora la distribuzione delle lettere dell'inglese, mentre la tabella dei bigrammi riconosce coppie come QU o TH anche in poche lettere.
L'attacco presuppone inoltre un normale testo inglese: un testo fatto di una sola lettera ripetuta, un pangramma o un testo in un'altra lingua possono ingannarlo.
In ogni caso Cesare non è mai sicuro, perché le 26 chiavi si possono sempre provare a mano: la statistica serve solo a scegliere in automatico quella leggibile.</p>
<p>5. La debolezza dello schema EC non è la curva ma l'intervallo ridotto di d, quindi la chiave si può cercare.
La forza bruta prova d = 1, 2, 3, ..., una somma di punti per volta, finché dG non coincide con Q. Misurando in Chrome sul PC usato per l'homework, ogni somma richiede circa 20 microsecondi,
quindi la d = 50123 di default si trova in circa 1 secondo e uno spazio di 2^18 in al massimo 5 secondi, mentre 2^20 richiederebbe circa 20 secondi: per questo la pagina limita la forza bruta a 2^18.
Baby-step giant-step fa la stessa ricerca in circa 2 sqrt(spazio delle chiavi) passi usando una tabella: circa 10 ms per 2^16, 60 ms per 2^21 e meno di 3 secondi per 2^32,
quindi arriva a spazi delle chiavi molto più grandi. Una volta trovata d, il messaggio si decifra con quella.
<br>I due attacchi sono di natura diversa. Rompere Cesare è inferenza statistica: legge una regolarità che il testo in chiaro ha lasciato nel cifrato,
e richiede abbastanza testo perché questa regolarità emerga. Rompere lo schema EC è una ricerca della chiave: ignora il cifrato e confronta le chiavi solo con la Q pubblica,
ed è per questo che funziona anche se il cifrato EC è statisticamente piatto. Un output piatto nasconde il testo in chiaro, non la chiave.
Un attacco sfrutta un testo in chiaro non uniforme, l'altro uno spazio delle chiavi piccolo.
<br>Con una curva configurata correttamente nessuno dei due attacchi è praticabile. Con d qualsiasi in [1, 2^256) la forza bruta richiede circa 2^256 somme,
e baby-step giant-step circa 2^128 passi e 2^128 punti di memoria. Pollard rho, il miglior attacco generico, costa anch'esso circa 2^128 passi ma quasi senza memoria,
e resta comunque fuori portata. Il metodo è lo stesso, cambia solo la dimensione dello spazio, e il logaritmo discreto resta difficile.
Per questo le vere chiavi secp256k1 usano tutto l'intervallo.
<br>Infine, da dove viene ciascuna debolezza. Forza bruta e baby-step giant-step dipendono solo dallo spazio delle chiavi ridotto, e una d di dimensione piena le elimina.
Il design dello schema ha problemi diversi che una chiave più lunga non risolve. Il keystream è un semplice generatore lineare congruenziale, quindi è prevedibile,
e il suo seed usa solo 64 bit di x(S), quindi esistono al massimo 2^64 keystream qualunque sia la dimensione di d.
Non c'è un MAC, quindi un cifrato può essere modificato senza che ci si accorga, e ridurre il punto condiviso a uno stream mod 26 ne butta via quasi tutto.
Un vero ECIES risolve questi problemi con una funzione di derivazione della chiave adeguata, un vero cifrario e un MAC, indipendentemente dalla lunghezza della chiave.</p>`,
    errD: 'd deve essere un numero intero di almeno 1',
    ephem: 'r effimero',
    ephemNote: '(casuale, scartato dopo la cifratura)',
    sent: 'inviato insieme al cifrato',
    shared: 'segreto condiviso',
    ct: 'cifrato',
    dec: 'decifrato',
    usesD: '(usa d)',
    usesK: '(usa k)',
    f1: 'testo in chiaro',
    f2: 'cifrato con Cesare',
    f3: 'cifrato con EC',
    chiTitle: L => `somiglianza con l'inglese per ogni shift, chi-quadro (barra più alta = chiave scelta), ${L} lettere`,
    bgTitle: L => `punteggio dei bigrammi per ogni shift (barra più alta = chiave scelta), ${L} lettere`,
    exHead: 'tutti i 26 shift, scegli quello leggibile:',
    guessed: k => `chiave trovata k = ${k}`,
    ok: '  (corretta)',
    wrong: k => `  (sbagliata, k reale = ${k})`,
    plain: 'in chiaro',
    cmp: (a, b, k) => `chi-quadro: k = ${a},  bigrammi: k = ${b},  k reale = ${k}`,
    sucTitle: n => `frazione di ${n} campioni casuali in cui la chiave viene trovata`,
    chiName: 'chi-quadro',
    bgName: 'bigrammi',
    letters: 'lettere',
    space: (B, b) => `spazio delle chiavi 2^${B} = ${b}`,
    tooBf: 'troppo grande per la forza bruta nel browser (limite 2^18), usa baby-step giant-step',
    tooBs: 'troppo grande per il browser (limite 2^32), vedi le note su Pollard rho',
    running: 'in esecuzione...',
    notFound: B => `non trovata sotto 2^${B} (la d reale è più grande dello spazio delle chiavi impostato)`,
    found: d => `chiave privata trovata d = ${d}`,
    matches: '  (coincide)',
    tookBf: (ms, d) => `${ms} ms, circa ${d} somme di punti`,
    tookBs: (ms, s, b) => `${ms} ms, circa ${s} passi invece di ${b}`,
    decWith: 'decifrato con la d trovata:'
  },
  hw3: {
    title: 'HW3 - punteggio di penetrazione, LGN e TLC',
    dl: 'scarica',
    h1: 'HW3 - n sistemi, m attaccanti e il punteggio di penetrazione aggregato',
    intro: 'Ogni attaccante attraversa gli n sistemi uno alla volta e a ogni passo ottiene un punteggio X. Gli m attaccanti sono indipendenti, quindi le m traiettorie sono m campioni della stessa passeggiata aleatoria.',
    modelL: 'modello',
    optB: 'Bernoulli, X in {0,1}, P(X=1) = p',
    optR: 'Rademacher, X in {-1,+1}, p = 1/2',
    run: 'esegui',
    hTraj: '1. traiettorie',
    viewL: 'vista',
    first: 'disegna i primi',
    first2: 'attaccanti, rosso: media teorica e più o meno una deviazione standard',
    hDist: "2. distribuzione delle tre quantità all'n finale",
    distNote: 'nero: gli m attaccanti, rosso: la densità normale prevista dal teorema del limite centrale',
    hLln: '3. legge dei grandi numeri',
    lln1: 'frazione di attaccanti con |S_n/n - media| > e, per e =',
    lln2: ', confrontata con il limite di Chebyshev',
    hVar: '4. varianza con le tre normalizzazioni',
    varNote: 'scala logaritmica, punti: misurati sugli m attaccanti, linee: teoria',
    hClt: '5. teorema del limite centrale',
    cltNote: 'punteggio standardizzato (S_n - n*media) / (dev*sqrt(n)) confrontato con la normale standard, e la massima distanza tra le due funzioni di ripartizione',
    notesH: 'note',
    notes: `<p>I valori di default sono il modello di Bernoulli con p = 0.3, n = 1000 sistemi e m = 2000 attaccanti.
Ogni grafico è costruito dalle m traiettorie simulate al momento, niente è precalcolato.
Le tre quantità vengono registrate a 44 valori di n distribuiti su scala logaritmica tra 1 e l'n finale, quindi ogni grafico in funzione di n mostra il comportamento per n crescente con una sola simulazione.</p>
<p>Il modello. Un attaccante attraversa i sistemi in ordine e al sistema i ottiene il punteggio X_i.
Nel modello di Bernoulli X_i = 1 significa che il sistema è stato violato e p è la probabilità di successo per sistema, quindi S_n conta quanti degli n sistemi sono stati compromessi.
Il modello di Rademacher dà +1 per un successo e -1 per un fallimento con la stessa probabilità. La media del passo è zero,
e rappresenta il caso simmetrico, senza alcuna deriva.
Gli m attaccanti non interagiscono, quindi m non cambia il processo: è il numero di campioni usati per vederne la distribuzione.</p>
<p>Le tre viste della sezione 1 riassumono il comportamento. S_n si apre a ventaglio, con un'ampiezza che cresce come sqrt(n) attorno alla retta n per la media del passo.
S_n/n sono gli stessi dati divisi per n, e il ventaglio si stringe sulla media del passo. S_n/sqrt(n) divide quanto basta per mantenere il ventaglio di ampiezza costante.
Le curve rosse sono la media teorica e più o meno una deviazione standard.</p>
<p>Legge dei grandi numeri. S_n/n converge in probabilità alla media del passo, p per Bernoulli e 0 per Rademacher.
La sezione 3 lo mostra direttamente: la frazione di attaccanti la cui media dista più di e dalla media teorica tende a zero al crescere di n.
La disuguaglianza di Chebyshev dà il limite varianza / (n e^2), disegnato in rosso. La frazione misurata resta sotto il limite e scende molto più in fretta,
perché Chebyshev usa solo la varianza, mentre la coda reale è vicina a quella normale e decresce in modo esponenziale.</p>
<p>Varianza. Un singolo passo ha varianza s^2, che vale p(1-p) per Bernoulli e 1 per Rademacher.
I passi sono indipendenti, quindi le varianze si sommano: Var(S_n) = n s^2, Var(S_n/n) = s^2 / n e Var(S_n/sqrt(n)) = s^2.
Sulla scala logaritmica della sezione 4 sono una retta crescente, una decrescente e una orizzontale, e i punti misurati stanno su di esse.
Per questo le tre normalizzazioni si comportano in modo così diverso: dividere per n è troppo e annulla la fluttuazione,
non dividere la lascia crescere senza limite, e dividere per sqrt(n) è l'unica scelta che la mantiene finita e diversa da zero.</p>
<p>Teorema del limite centrale. Per Rademacher la media del passo è 0 e la varianza è 1, quindi S_n/sqrt(n) è già standardizzato
e converge in distribuzione a N(0,1) senza alcuna modifica. Per Bernoulli la stessa quantità ha media sqrt(n) p,
che cresce senza limite, quindi S_n/sqrt(n) non converge e il limite normale compare solo dopo aver centrato,
cioè con (S_n - n p) / sqrt(n p (1-p)). La sezione 5 confronta questo punteggio standardizzato con la normale standard.</p>
<p>Nel grafico la massima distanza tra le due funzioni di ripartizione non va a zero, per due motivi.
S_n assume valori su un reticolo (interi per Bernoulli, interi a distanza due per Rademacher), quindi la sua funzione di ripartizione è a gradini,
mentre quella normale è continua. Vicino al centro ogni gradino, dopo la standardizzazione, è alto circa 0.4 volte il passo del reticolo,
e la curva normale può al massimo passare a metà del gradino, quindi la distanza non può scendere sotto mezzo gradino:
circa 0.4/sqrt(n) per Rademacher, la curva rossa del grafico.
Il secondo limite, la linea blu, è la distanza che mostrerebbe anche un campione di m punti estratti da una normale esatta, circa 0.87/sqrt(m).
La convergenza in distribuzione vale e le due funzioni di ripartizione coincidono al limite,
ma un n finito e un m finito lasciano ciascuno una traccia visibile, e la distanza misurata segue il maggiore dei due limiti.</p>
<p>Il ruolo di n e m. Hanno compiti diversi. n è la dimensione della superficie di attacco e guida la matematica:
la concentrazione di S_n/n, la crescita come sqrt(n) delle fluttuazioni e l'avvicinamento alla forma normale.
Per il singolo attaccante m non cambia nulla, stabilisce solo con quanta precisione si misura il processo.
Il +- stampato accanto a ogni numero è l'errore Monte Carlo dovuto a m, circa s/sqrt(m) per una media
e circa sqrt(2/m) in termini relativi per una varianza. Con m = 2000 una varianza misurata può discostarsi di qualche punto percentuale dalla teoria
senza che ci sia nulla di sbagliato, ed è per questo che i due valori sono stampati uno accanto all'altro. Un m adatto è quello che rende questo errore
piccolo rispetto all'effetto che si vuole studiare: aumentare m rende gli istogrammi più regolari e abbassa la linea blu,
mentre aumentare n è ciò che fa comportare in modo diverso le tre normalizzazioni.</p>
<p>In termini di sicurezza. Il numero atteso di sistemi compromessi è n p e cresce con la dimensione dell'organizzazione,
quindi un'organizzazione più grande perde più macchine in termini assoluti. Il tasso di compromissione S_n/n si stabilizza su p qualunque sia la dimensione,
quindi la frazione di sistemi che cadono dipende dalla difesa di ciascun sistema e non da quanti sistemi ci sono.
Con n cambia invece la prevedibilità: la dispersione relativa del tasso è s / (p sqrt(n)) e si riduce,
quindi una grande organizzazione perde una frazione molto prevedibile, mentre per una piccola il risultato dipende molto di più dal caso, in entrambe le direzioni.
<br>Il numero di attaccanti conta quando i loro risultati vengono combinati, e le ultime due righe dell'output mostrano i due modi.
Tutti gli m attaccanti insieme hanno un punteggio totale con media m n p, che cresce sia con m sia con n.
Il migliore degli m attaccanti finisce circa sqrt(2 ln m) deviazioni standard sopra la media (un po' meno per m piccolo), quindi il suo vantaggio cresce solo lentamente con m,
ma per chi difende di solito è proprio il migliore attaccante, e non quello medio, a decidere l'esito.
<br>Il caso simmetrico di Rademacher rappresenta una difesa che vince tanto spesso quanto perde: il punteggio netto atteso è zero,
ma il punteggio reale si allontana comunque da zero come sqrt(n), quindi anche una situazione in equilibrio produce grandi squilibri assoluti su un gran numero di sistemi.</p>`,
    errP: 'p deve essere strettamente compreso tra 0 e 1',
    errBig: 'n per m è troppo grande per il browser, riduci n o m',
    head: (model, mu, v, n, m) => `${model},  media del passo = ${mu},  varianza del passo = ${v},  n = ${n},  m = ${m}`,
    mcNote: "il +- è l'errore Monte Carlo dovuto agli m attaccanti, non una proprietà del processo",
    mean: 'media',
    theory: 'teoria',
    variance: 'varianza',
    total: (m, v, e, s) => `tutti gli m = ${m} attaccanti insieme: punteggio totale ${v}  (teoria m*n*media = ${e}, deviazione standard ${s})`,
    best: (b, z, ez) => `miglior attaccante: S_n = ${b}, ${z} deviazioni standard sopra la media  (circa ${ez} attese per il migliore di m)`,
    trajTitle: q => `${q} in funzione del numero di sistemi`,
    llnTitle: e => `P(|S_n/n - media| > ${e})`,
    measured: 'misurato',
    cheb: 'limite di Chebyshev',
    varTitle: 'varianza delle tre quantità',
    vS: 'Var(S_n) cresce come n',
    vA: 'Var(S_n/n) cala come 1/n',
    vQ: 'Var(S_n/sqrt(n)) è costante',
    cltTitle: 'S_n standardizzato e N(0,1)',
    ksTitle: 'massima distanza dalla CDF normale',
    ksGrid: 'minimo dovuto al passo del reticolo di S_n',
    ksSamp: 'livello atteso dai soli m campioni',
    gap: (n, v) => `massima distanza a n = ${n}: ${v}`,
    floors: 'la distanza non può scendere sotto il maggiore dei due minimi, e i punti misurati seguono quello che prevale',
    latt: (v, s) => `  minimo del reticolo a questo n ${v}, perché S_n assume solo valori distanti ${s} e la normale è continua`,
    samp: v => `  livello di campionamento 0.87/sqrt(m) = ${v}, la distanza che mostrerebbe anche un campione esattamente normale di questa dimensione`,
    rad: 'S_n/sqrt(n) ha già media 0 e varianza 1, quindi converge a N(0,1) senza bisogno di centrarlo',
    ber: 'S_n/sqrt(n) ha media sqrt(n)*p, che cresce, quindi per il limite normale standard serve la centratura vista sopra'
  },
  hw4: {
    title: 'HW4 - Welford e media e varianza campionarie',
    dl: 'scarica',
    h1: 'HW4 - formule ricorsive di Welford, media campionaria e varianza campionaria',
    hEx1: 'Ex. 1 - formule ricorsive di Welford',
    deriv: `<p>La ricorsione di Knuth per la media. Sia M_k la media dei primi k valori. Poiché k M_k = (k-1) M_(k-1) + x_k,</p>
<pre>M_k = M_(k-1) + (x_k - M_(k-1)) / k</pre>
<p>La nuova media è quella vecchia corretta di una frazione 1/k dell'errore d_k = x_k - M_(k-1) che la vecchia media commette sul nuovo valore.</p>
<p>Somma dei quadrati. Lo stesso procedimento si applica a SS_k = somma_(i=1..k) (x_i - M_k)^2 = somma_(i=1..k) x_i^2 - k M_k^2.
Sottraendo la stessa espressione per k-1:</p>
<pre>SS_k - SS_(k-1) = x_k^2 - k M_k^2 + (k-1) M_(k-1)^2</pre>
<p>Si scrive x_k = M_(k-1) + d_k e M_k = M_(k-1) + d_k / k e si sviluppa. Tutti i termini che contengono M_(k-1) si annullano e resta solo d_k^2 - d_k^2 / k.
Poiché x_k - M_k = d_k (k-1) / k, il risultato si può scrivere con i due errori, prima e dopo l'aggiornamento della media:</p>
<pre>SS_k = SS_(k-1) + (x_k - M_(k-1)) (x_k - M_k)       SS_1 = 0</pre>
<p>Varianza. La varianza campionaria è s_k^2 = SS_k / (k-1) per k >= 2. Dividendo la ricorsione per k-1 si ottiene la ricorsione per la varianza:</p>
<pre>s_k^2 = (k-2)/(k-1) s_(k-1)^2 + d_k^2 / k</pre>
<p>Codice. Per ogni nuovo valore x, con k che parte da 1, il nucleo dell'algoritmo sono poche righe:</p>`,
    codeNote: "L'Ex. 2 usa questo codice per ogni hacker, e qui sotto si può provare su una lista di numeri qualsiasi.",
    dataL: 'numeri',
    calc: 'calcola',
    errData: 'inserisci almeno due numeri',
    hEx2: 'Ex. 2 - media e varianza campionarie',
    intro: 'm hacker attaccano ciascuno n sistemi e ottengono un punteggio tra 0 e 10 per ogni sistema. Il punteggio di default è il numero di passi riusciti su 10, ognuno riuscito con probabilità p, quindi è una binomiale(10, p) con mu = 10p e sigma^2 = 10p(1-p); il menu offre anche un punteggio uniforme su {0, ..., 10} e un punteggio continuo 10 Beta(2, 5). Per ogni hacker la ricorsione di Welford dà la media e la varianza campionarie degli n punteggi.',
    distL: 'distribuzione del punteggio',
    optB: 'binomiale(10, p)',
    optU: 'uniforme su {0, ..., 10}',
    optBe: '10 Beta(2, 5)',
    nB: p => `binomiale(10, ${p})`,
    nU: 'uniforme {0, ..., 10}',
    nBe: '10 Beta(2, 5)',
    run: 'esegui',
    hAvg: '1. medie sugli m hacker in funzione di n',
    avgNote: 'nero: media delle medie campionarie (sopra) e delle varianze campionarie (sotto), rosso: mu e sigma^2',
    hVar: '2. variabilità delle stime in funzione di n',
    varNote: 'scala logaritmica, punti: varianza sugli m hacker, linee: teoria, sigma^2/n per le medie e mu4/n - sigma^4 (n-3)/(n(n-1)) per le varianze (mu4 = momento centrale del quarto ordine)',
    notesH: 'note',
    notes: `<p>Conclusioni. Con i valori di default (p = 0.3, quindi mu = 3 e sigma^2 = 2.1) la media delle medie campionarie è 3.0005 e la media
delle varianze campionarie è 2.1015, entrambe entro l'errore Monte Carlo stampato accanto.
La sezione 1 ripete il confronto per 40 valori di n tra 2 e 1000, e l'accordo vale per ogni n, anche per n = 2 (2.154 +- 0.065 contro 2.1).
Lo stesso vale per le altre due distribuzioni del menu: 5.0029 contro mu = 5 e 9.9977 contro sigma^2 = 10 per il punteggio uniforme,
2.8588 contro 2.8571 e 2.5532 contro 2.5510 per 10 Beta(2, 5).
Quindi la media campionaria e la varianza campionaria calcolata con n - 1 sono stimatori non distorti: E[media] = mu ed E[s^2] = sigma^2.</p>
<p>Utilità nella statistica inferenziale. In pratica mu e sigma^2 non sono noti ed è disponibile un solo campione.
Poiché la media e la varianza campionarie sono non distorte, e la loro varianza tende a zero al crescere di n (sezione 2),
si possono usare per stimare i parametri della popolazione da un solo campione.
È la base dell'inferenza: l'errore standard sigma/sqrt(n) di una media si stima con s/sqrt(n),
e con esso si costruiscono intervalli di confidenza come media +- 1.96 s/sqrt(n) e test come il test t.</p>
<p>Effetto di n sulla variabilità. La sezione 2 mostra che la varianza delle medie campionarie segue sigma^2/n:
con i valori di default passa da 1.02 a n = 2 a 0.0021 a n = 1000, quindi quadruplicando i sistemi si dimezza la deviazione standard della media di un hacker.
Anche la varianza delle varianze campionarie, mu4/n - sigma^4 (n-3)/(n(n-1)), cala come 1/n: da 8.83 a n = 2 a 0.0083 a n = 1000.
Aumentare il numero di sistemi attaccati da ogni hacker rende quindi più precise entrambe le stime.</p>`,
    errP: 'p deve essere strettamente compreso tra 0 e 1',
    errBig: 'n per m è troppo grande per il browser (limite 1e7), riduci n o m',
    head: (name, mu, s2, n, m) => `${name},  mu = ${mu},  sigma^2 = ${s2},  n = ${n},  m = ${m}`,
    mcNote: "il +- è l'errore Monte Carlo dovuto agli m hacker, non una proprietà degli stimatori",
    measured: 'misurato',
    theory: 'teoria',
    rMean: 'media delle medie campionarie',
    rVar: 'media delle varianze campionarie',
    pmTitle: 'media delle medie campionarie',
    pvTitle: 'media delle varianze campionarie',
    vvTitle: 'varianza delle stime sugli hacker',
    vMeans: 'Var(media campionaria)',
    vVars: 'Var(varianza campionaria)'
  }
}
}
