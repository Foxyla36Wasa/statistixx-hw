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
  },
  hw5: {
    title: 'HW5 - Riemann and Lebesgue, normal CDF',
    dl: 'download',
    h1: 'HW5 - Riemann and Lebesgue integration, numerical computation of the normal CDF',
    hEx1: 'Es. 1 - Riemann and Lebesgue integration',
    intro1: `<p>Riemann: the domain [a, b] is cut into N subintervals of width h, and the integral is approximated by h times the sum of f at a tag in each subinterval,
the midpoint or a random point. Lebesgue: the range of f is cut into K levels of height d, each level set {x : y_j <= f(x) < y_j + d}, the preimage of a level,
gets the value y_j at the bottom of the level, and the integral is approximated by the sum of y_j times the measure of its preimage.
The measures are estimated with S random points, one in each of S equal cells of the domain.</p>
<p>Every floating point number is rational, so the Dirichlet and Thomae functions cannot be evaluated literally:
the midpoint tags (2i+1)/(2N) are treated as exact fractions p/q, while random points are treated as irrational, as they are with probability 1.</p>`,
    fnL: 'function',
    f0: 'sin(x), x in [0, pi]',
    f1: 'x^2, x in [0, 1]',
    f2: '1 if x < 0.5, 3 if x >= 0.5, x in [0, 1]',
    f3: '|x - 0.5|, x in [0, 1]',
    f4: '1/sqrt(x), x in (0, 1]',
    f5: '1 if x < 0.5, 0 if x >= 0.5, x in [0, 1]',
    f6: 'sin(x)/x, x in [0, pi]',
    f7: 'Dirichlet: 1 if x is rational, 0 if irrational, x in [0, 1]',
    f8: 'Thomae: 1/q if x = p/q in lowest terms, 0 if irrational, x in [0, 1]',
    run: 'run',
    hConv: '1. error against the number of parts',
    convNote: 'log scale, black: Riemann sum with midpoints against N, red: Lebesgue lower sum against K with the same S points',
    hAll: '2. all the functions',
    allNote: 'values with the N, K and S above; the exact column is the Lebesgue integral (for Dirichlet the Riemann integral does not exist)',
    hEx2: 'Es. 2 - numerical computation of the normal CDF',
    intro2: `<p>Phi(x) = 1/2 + integral from 0 to x of phi(t) dt, with phi(t) = exp(-t^2/2) / sqrt(2 pi). The page compares four methods:</p>
<pre>1. Simpson's rule     integral of phi on [0, x] with n intervals
2. erf power series   Phi(x) = 1/2 + 1/sqrt(2 pi) sum_k (-1)^k x^(2k+1) / (2^k k! (2k+1))
3. erf approximation  Phi(x) = (1 + erf(x/sqrt(2))) / 2, with erf from formula 7.1.26 of Abramowitz and Stegun
4. proposed method    |x| < 3:   Phi(|x|) = 1/2 + phi(x) sum_k |x|^(2k+1) / (1 * 3 * 5 * ... * (2k+1))
                      |x| >= 3:  1 - Phi(|x|) = phi(x) / (|x| + 1/(|x| + 2/(|x| + 3/(|x| + ...)))), 60 terms
                      and Phi(-x) = 1 - Phi(x)</pre>`,
    simpL: 'Simpson:',
    hRef: '1. comparison with the reference',
    refNote: 'reference: Phi(n) = (1 + P(|Z| <= n)) / 2, with the 15-digit values of P listed in the Wikipedia article "68-95-99.7 rule"; Simpson uses the n above; errors are value minus reference',
    hEff: '2. accuracy and efficiency',
    effNote: 'time per evaluation averaged over 200 points in [-7, 7] (it depends on the computer), and largest absolute error at the reference points; below, the error of Simpson\'s rule at x = 3 against n (log scale)',
    notesH: 'notes',
    notes: `<p>Es. 1, the functions. The collection is the list of the assignment: seven ordinary functions and the two pathological ones, Dirichlet and Thomae.
Section 2 gives the three approximations of every integral with the default values N = K = 1000 and S = 100000.</p>
<p>Es. 1, accuracy and convergence. For smooth functions the Riemann sum with midpoints converges like 1/N^2: for sin(x) the error is 8.2e-5, 8.2e-7 and 8.2e-9
with N = 100, 1000 and 10000. The Lebesgue lower sum converges like 1/K and always from below, because each level set gets the value at the bottom of its level:
for sin(x) the error is -1.6e-2, -1.6e-3 and -1.6e-4 with K = 100, 1000 and 10000. Its error comes from the height of the levels, not from S:
with S = 1000000 and K = 10000 it is still -1.6e-4.</p>
<p>Es. 1, computational efficiency. The Riemann sum needs N evaluations of f: for sin(x) N = 1000 takes about 0.2 ms and gives an error below 1e-6.
The Lebesgue sum needs to know the measure of every preimage, which here means evaluating f at S points of the whole domain and sorting the values into the K levels:
about 10 ms with S = 100000, for an error of 1.6e-3. Reaching 1e-6 would need about a million levels and at least as many points.
For the usual functions the Riemann approach is therefore much cheaper; the Lebesgue approach becomes cheap only when the preimages are known exactly.</p>
<p>Es. 1, Riemann-integrable functions. For sin(x), x^2, the two step functions, |x - 0.5|, sin(x)/x and the Thomae function the three columns of section 2
agree with the exact value, and the differences go to zero as N and K grow: the two approaches converge to the same value, as the theory says
(when the Riemann integral exists, it is equal to the Lebesgue integral).</p>
<p>Es. 1, functions where the two approaches behave differently.
The step functions are simple functions, so the Lebesgue sum is exact for every K, while the Riemann sum is exact only when a partition point falls on 0.5:
with N = 101 the error is 9.9e-3 for the 1/3 step. |x - 0.5| is similar: the midpoint rule is exact for even N, but with N = 101 the error is 2.5e-5.
1/sqrt(x) is unbounded, so its Riemann integral exists only as an improper integral: the midpoint sums converge slowly, like 1/sqrt(N)
(errors 6.0e-2, 1.9e-2 and 6.0e-3 with N = 100, 1000 and 10000), and the Lebesgue sum with equal levels is even worse, because the range
goes from 1 to several hundred and the levels are coarse (errors 0.70, 0.18 and 0.022 with K = 100, 1000 and 10000).
The Dirichlet function shows the real difference: Riemann sums with rational tags give 1 for every N and with irrational tags give 0,
so they do not converge and the Riemann integral does not exist, while for Lebesgue the rationals are countable, have measure 0, and the integral is 0.
The Thomae function is Riemann integrable with integral 0, but the Riemann sums with rational tags approach 0 slowly (1.3e-2, 1.7e-3 and 2.1e-4 with N = 100, 1000 and 10000),
while the Lebesgue sum gives 0 at once, because f is 0 outside a set of measure 0.</p>
<p>Es. 2, the method. The proposed method (method 4) uses the series Phi(x) = 1/2 + phi(x) (x + x^3/3 + x^5/(3*5) + ...) for |x| &lt; 3.
All its terms are positive, so there is no cancellation, and it needs at most 33 terms. For |x| >= 3 it uses Laplace's continued fraction,
which gives the tail 1 - Phi(x) directly, so the small probabilities in the tails keep their relative accuracy. 60 terms are enough from x = 3 on.</p>
<p>Es. 2, comparison with the reference. The reference values are Phi(n) = (1 + P(|Z| &lt;= n)) / 2 for n = 0, ..., 7, with P taken from the Wikipedia article
"68-95-99.7 rule", which gives it with 15 decimals, so the reference itself is accurate to about 5e-16. Method 4 agrees with every reference value within 3.3e-16,
so its error is at the level of the reference and of double precision.</p>
<p>Es. 2, accuracy and efficiency of the approaches. Times are measured in the browser on the computer used for this homework.
Simpson's rule with n = 100 has a largest error of 3.6e-10 and takes about 1.8 microseconds per value, because it evaluates phi n + 1 times;
its error falls like 1/n^4 (section 2): at x = 3 it is 3.6e-10 with n = 100 and 3.6e-14 with n = 1000.
The power series of erf is exact for small x, but its terms alternate in sign and become much larger than the result (about 2e8 at x = 7),
so rounding errors are amplified: the error grows from 1e-16 at x &lt;= 3 to 3.6e-8 at x = 7. The erf approximation of Abramowitz and Stegun is the fastest,
about 0.05 microseconds, but its error is fixed by the formula (up to 1.5e-7 for erf) and reaches 6.9e-8 at the reference points.
Method 4 takes between 0.2 and 0.3 microseconds and is accurate to double precision everywhere, so it is the most efficient of the four for full accuracy.</p>
<p>Es. 2, why Phi is not elementary. Phi is an antiderivative of phi(x) = exp(-x^2/2) / sqrt(2 pi). Liouville's theorem (1835) gives a criterion for
integrals of the form f(x) exp(g(x)) with f and g rational: the antiderivative is an elementary function only if there is a rational function R with f = R' + R g'.
Here f = 1 and g = -x^2/2, so R would have to satisfy R' - x R = 1. If R is a polynomial of degree d, R' - x R has degree d + 1 >= 1 and cannot be the constant 1.
If R has a pole of order m at some point, R' has a pole of order m + 1 there and x R one of order at most m, so R' - x R still has a pole.
No rational R exists, so exp(-x^2/2) has no elementary antiderivative, and Phi cannot be written with a finite combination of polynomials, exponentials, logarithms,
roots and trigonometric functions.</p>
<p>Es. 2, the error function. erf(x) = 2/sqrt(pi) times the integral from 0 to x of exp(-t^2) dt is defined as a new function exactly to give a name to this integral,
and with it the CDF has an exact closed form, Phi(x) = (1 + erf(x / sqrt(2))) / 2. This moves the problem but does not solve it numerically:
erf is not elementary either, so its values still have to be computed with series, continued fractions or rational approximations, which is what libraries do
(JavaScript has no built-in erf at all). Methods 2, 3 and 4 are exactly such computations, and method 1 goes back to the integral itself.</p>`,
    errSize: 'N and K must be between 1 and 1e6, S between 10 and 2e6',
    head: (name, I) => `${name},  exact integral = ${I}`,
    dirNote: 'the Riemann integral does not exist: 0 is the Lebesgue integral',
    sqrtNote: 'f is unbounded, so 2 is an improper Riemann integral',
    value: 'value',
    error: 'error',
    evals: 'f evals',
    ms: 'ms',
    rMid: N => `Riemann, midpoints, N = ${N}`,
    rRand: N => `Riemann, random tags, N = ${N}`,
    leb: (K, S) => `Lebesgue, K = ${K}, S = ${S}`,
    convTitle: 'absolute error against the number of parts (1e-16 = exact)',
    convR: 'Riemann, N subintervals',
    convL: S => `Lebesgue, K levels, S = ${S}`,
    exact: 'exact',
    colMid: 'R. midpoints',
    colRand: 'R. random',
    colLeb: 'Lebesgue',
    errX: 'x must be a number and n between 2 and 1e6',
    diff: 'minus m. 4',
    terms: 'terms',
    m1: '1. Simpson',
    m2: '2. erf power series',
    m3: '3. erf approximation (A&S)',
    m4: '4. proposed method',
    refCol: 'reference',
    m4s: 'method 4',
    m2s: 'series',
    usPer: 'us / eval',
    maxErr: 'max error',
    simpTitle: "Simpson's rule, absolute error at x = 3 against n",
    simpName: 'measured'
  },
  hw6: {
    title: 'HW6 - statistical independence',
    dl: 'download',
    h1: 'HW6 - statistical independence: contingency table and chi-square test',
    intro: 'The dataset is a list of records (x, f), one per line. By default it is a simulated sample of n attacks: X is the attack type and F its outcome, with outcome probabilities that depend on the attack type. Any other dataset can be pasted in the box below.',
    gen: 'generate',
    dataL: 'records (x, f), one per line, separated by a comma, semicolon or tab',
    run: 'compute',
    hTab: '1. contingency table and marginal frequencies',
    tabNote: 'observed counts n_ij, row and column totals n_i. and n_.j, and marginal relative frequencies n_i./n and n_.j/n',
    hCond: '2. conditional frequencies',
    condNote: 'top: distribution of F for each value of X, n_ij / n_i.; below: distribution of X for each value of F, n_ij / n_.j; chart: the first table, one bar for each value of X and one for the marginal of F',
    hExp: '3. expected frequencies under independence and chi-square',
    expNote: 'expected counts E_ij = n_i. n_.j / n, and the contribution (n_ij - E_ij)^2 / E_ij of each cell to the chi-square statistic',
    notesH: 'notes',
    notes: `<p>Contingency table and frequencies. The page reads the records, collects the values of X and F, and counts how many records fall in each pair (x_i, f_j):
these counts n_ij form the contingency table of section 1. The row and column totals divided by n are the marginal frequencies of X and F,
and dividing each count by its row or column total gives the conditional frequencies of section 2.
With the default data, 29.6% of all attacks end in a compromise, but the conditional frequency is 46.5% for phishing and 9.5% for brute force.</p>
<p>Expected frequencies and chi-square. If X and F were independent, the expected count of each cell would be E_ij = n_i. n_.j / n (section 3).
The statistic chi^2 = sum over all cells of (n_ij - E_ij)^2 / E_ij measures how far the observed table is from these counts.
With the default data chi^2 = 79.574 with (4-1)(3-1) = 6 degrees of freedom, and the p-value is 4.37e-15.
The largest contributions come from phishing (21.0 for compromised and 15.8 for blocked) and brute force (14.9 for blocked and 13.0 for compromised).
The smallest expected count is 15.72, above 5, so the chi-square approximation is reliable.</p>
<p>Independence in probability. Two events A and B are independent when P(A and B) = P(A) P(B), which is the same as P(A | B) = P(A): knowing that B happened
does not change the probability of A. Two random variables X and F are independent when P(X = x, F = f) = P(X = x) P(F = f) for every pair of values,
so the conditional distribution of F is the same for every value of X and equal to the marginal distribution of F.</p>
<p>Independence in statistics. On observed data the same idea is written with relative frequencies: X and F are statistically independent in the sample
when n_ij / n = (n_i. / n)(n_.j / n) for every cell, that is when n_ij = E_ij and all the rows of the conditional table f(F | X) are equal to the marginal of F.
In a real sample this never holds exactly, even when the variables are independent in probability, because of random fluctuations.
The chi-square test decides whether the differences are too large to be fluctuations: under the hypothesis of independence chi^2 follows approximately
a chi-square distribution with (r-1)(c-1) degrees of freedom, whose mean is 6 here and which exceeds 12.59 only 5% of the time.</p>
<p>Interpretation. The observed chi^2 = 79.574 is far above 12.59, and the p-value 4.37e-15 means that a table this far from independence would almost never appear
if X and F were independent. Independence is rejected: the outcome of an attack depends on its type. The conditional table shows how: phishing is compromised
much more often than the average (46.5% against 29.6%), while brute force is blocked 70.5% of the time against an average of 44.2%.
This agrees with how the data were simulated, with outcome probabilities that change with the attack type.
A large p-value would not prove independence, it would only mean that the data do not show a dependence.</p>
<p>Association and causality. The test shows an association between attack type and outcome, not its cause, and it does not even give a direction.
Phishing could succeed more often because it targets people instead of systems, but the same table would also appear if the organisations that receive
more phishing had weaker defences (a third variable that influences both), or if only some outcomes were recorded (for example only the attacks that were detected).
To claim that the attack type causes the outcome one needs a controlled experiment, where the type is assigned at random, or a causal model that accounts
for the other variables. Statistical dependence is necessary for a causal effect, but not sufficient.</p>`,
    errN: 'n must be between 10 and 100000',
    errData: 'the data must contain at least two values of X and two values of F',
    head: (n, r, c, bad) => `${n} records, ${r} values of X, ${c} values of F` + (bad ? `, lines skipped: ${bad}` : ''),
    chi: (x, df) => `chi-square = ${x},  degrees of freedom (r-1)(c-1) = ${df}`,
    pval: p => `p-value = P(chi2 > observed) = ${p}`,
    minE: v => `smallest expected count = ${v}`,
    warnE: '(below 5: the chi-square approximation is not reliable)',
    dep: 'p < 0.05: independence is rejected, X and F are dependent',
    indep: 'p >= 0.05: the data are compatible with independence',
    total: 'total',
    marg: 'marginal',
    condF: 'f(F | X) = n_ij / n_i.',
    condX: 'f(X | F) = n_ij / n_.j',
    expT: 'expected counts E_ij',
    contT: 'contributions (n_ij - E_ij)^2 / E_ij',
    barsTitle: 'f(F | X) for each value of X, and the marginal of F'
  },
  hw7: {
    title: 'HW7 - convergence and Bayes',
    dl: 'download',
    h1: "HW7 - modes of convergence, conditional probability and Bayes' theorem",
    hEx1: 'Ex. 1 - modes of convergence in probability theory',
    defs: `<p>Let X_1, X_2, ... and X be random variables defined on the same probability space. The four main modes of convergence of X_n to X are:</p>
<pre>almost surely (a.s.)   P(lim X_n = X) = 1
in probability         for every e > 0:  P(|X_n - X| > e) -> 0
in mean square (L^2)   E[(X_n - X)^2] -> 0
in distribution        F_n(x) -> F(x) at every point x where F is continuous

relations              a.s.  => in probability => in distribution
                       L^2   => in probability  (Chebyshev: P(|X_n - X| > e) <= E[(X_n - X)^2] / e^2)
                       in distribution to a constant c => in probability to c</pre>`,
    hBc: '1. in probability but not almost surely',
    bcNote: 'X_1, X_2, ... are independent, X_n = 1 with probability p_n and 0 otherwise. Since P(X_n = 1) = p_n -> 0 (blue line), X_n -> 0 in probability, and also in mean square because E[X_n^2] = p_n. Almost sure convergence needs that, in almost every sequence, all the values are 0 after some index. By the Borel-Cantelli lemmas this happens with probability 1 if the sum of the p_n is finite (p_n = 1/n^2, red) and with probability 0 if it is infinite (p_n = 1/n, black). The table and the chart give, for each n, the fraction of the m simulated sequences that still have a 1 between n and N (dots) and its exact value (lines).',
    run: 'run',
    hEx2: "Ex. 2 - conditional probability, Bayes' theorem and statistical inference",
    bayes: `<p>Conditional probability: P(A | B) = P(A and B) / P(B), for P(B) > 0. Writing P(A and B) in the two possible ways gives Bayes' theorem,
here for an unknown quantity theta and observed data x:</p>
<pre>P(theta | x) = P(x | theta) P(theta) / P(x),     P(x) = sum (or integral) over theta of P(x | theta) P(theta)
posterior    = likelihood * prior / evidence</pre>`,
    hAlarm: '1. a discrete example: an intrusion alarm',
    alarmNote: "A = an attack is in progress. The prior P(A) is the base rate of attacks; the likelihood is given by the detection rate P(alarm | A) and the false alarm rate P(alarm | not A). The table applies Bayes' theorem after each alarm, using the posterior of one step as the prior of the next (alarms independent given A or not A).",
    priorL: 'prior P(A)',
    sensL: 'P(alarm | A)',
    fprL: 'P(alarm | not A)',
    kL: 'alarms',
    hBeta: '2. a continuous example: Beta prior and binomial likelihood',
    betaNote: 'theta = probability that an attack on a system succeeds. Prior Beta(a, b), with mean a/(a+b); data: k successes in n attacks, with binomial likelihood proportional to theta^k (1-theta)^(n-k); the posterior is again a Beta, Beta(a + k, b + n - k). The interval is the central 95% credible interval. Chart: black posterior, red likelihood (normalised to area 1), blue prior.',
    dataL: 'data:',
    notesH: 'notes',
    notes: `<p>Ex. 1, differences between the modes. Almost sure convergence is about single sequences: with probability 1 the sequence of numbers X_n(omega) converges to X(omega).
Convergence in probability only asks that, for each fixed large n, a deviation |X_n - X| > e is unlikely; rare large deviations can keep appearing at different n, so it is weaker.
Mean-square convergence asks that the average squared distance E[(X_n - X)^2] goes to 0; by Chebyshev's inequality it implies convergence in probability,
but it needs finite second moments and it is not implied by almost sure convergence (X_n = n with probability 1/n^2 and 0 otherwise goes to 0 almost surely, but E[X_n^2] = 1).
Convergence in distribution only concerns the distribution functions, not the values: if Z is N(0,1), the sequence X_n = -Z converges in distribution to Z,
although |X_n - Z| = 2|Z| never becomes small. So almost sure and mean-square convergence each imply convergence in probability, which implies convergence in distribution,
and the converses are false in general. Section 1 shows a sequence that converges in probability and in mean square but not almost surely:
with p_n = 1/n the fraction of sequences that still have a 1 after n = 1000 is 0.898 (exact value 0.900 with N = 10000, and it tends to 1 as N grows),
while with p_n = 1/n^2 it is already 0.097 after n = 10 and 0.007 after n = 100.</p>
<p>Ex. 1, role in the LLN, the CLT and other results. For i.i.d. X_i with mean mu, the weak law of large numbers states that the sample mean S_n/n converges to mu in probability;
when the variance sigma^2 is finite it follows from E[(S_n/n - mu)^2] = sigma^2/n, so the convergence is also in mean square.
The strong law (Kolmogorov) states almost sure convergence and only needs E|X| finite: almost every single sequence of averages settles at mu,
which justifies estimating mu from one long sample, as in HW3 and HW4.
The central limit theorem is a statement in distribution: (S_n - n mu) / (sigma sqrt(n)) converges in distribution to N(0, 1), and it does not converge in probability,
because the standardised sum keeps fluctuating with variance 1 instead of settling to a value.
Other results use the same modes: consistency of an estimator is convergence in probability to the true parameter, the Glivenko-Cantelli theorem gives almost sure
uniform convergence of the empirical distribution function, and asymptotic normality of estimators, Slutsky's theorem and the delta method are statements in distribution,
which is what confidence intervals and tests use.</p>
<p>Ex. 1, why sqrt(n). For a sum S_n = X_1 + ... + X_n, Var(S_n) is the sum of the variances plus twice the sum of the covariances.
If the X_i are independent, or just uncorrelated, the covariances are 0 and the variances add: Var(S_n) = n sigma^2, so the standard deviation of the sum grows like sqrt(n), not like n.
Dividing by n gives Var(S_n/n) = sigma^2/n, which goes to 0 (law of large numbers); dividing by sqrt(n) gives a variance that stays sigma^2,
which is the only scale where a non-degenerate limit can exist (central limit theorem).
In statistical inference the same fact gives the standard error sigma/sqrt(n) of the mean: confidence intervals shrink like 1/sqrt(n), so four times more data halve their width,
as measured in HW3 and HW4. Independence is what makes this work: with positively correlated data the covariances add up and the variance of the mean decreases more slowly
(with n identical copies it does not decrease at all), so formulas that assume sqrt(n) would be too optimistic.</p>
<p>Ex. 2, conditional probability. In probability theory P(A | B) = P(A and B) / P(B) is the probability of A in the restricted world where B happened;
it gives the multiplication rule P(A and B) = P(A | B) P(B), the law of total probability P(A) = sum of P(A | B_i) P(B_i), and the definition of independence, P(A | B) = P(A).
In statistics conditioning is how data enter: relative frequencies within a group (the conditional tables of HW6) estimate conditional probabilities,
and every model gives the probability of the data given the parameters, P(x | theta). Frequentist inference keeps theta fixed and studies the data given theta;
Bayesian inference also conditions in the other direction, on the observed data, and gives P(theta | x).</p>
<p>Ex. 2, prior, likelihood and posterior. The prior P(theta) is the distribution of the unknown quantity before seeing the data.
The likelihood L(theta) = P(x | theta) is the probability of the observed data for each possible value of theta, read as a function of theta (it is not a distribution over theta).
The posterior P(theta | x) is the distribution of theta after the data. Bayes' theorem connects them: posterior = likelihood * prior / P(x),
so the posterior is proportional to likelihood times prior, and the evidence P(x) only makes it sum or integrate to 1.
Values of theta that are plausible a priori and also explain the data well get a high posterior probability.</p>
<p>Ex. 2, why updating is central. The posterior summarises everything the data say about theta, given the model and the prior, and it is used directly:
point estimates (posterior mean), credible intervals, probabilities of hypotheses and decisions. When new independent data arrive, the current posterior becomes the new prior
and Bayes' theorem is applied again, which gives the same result as using all the data at once. Section 1 does exactly this: with a base rate of 1%, a detection rate of 99%
and 5% false alarms, the probability of an attack goes from 0.01 to 0.1667 after one alarm, 0.7984 after two and 0.9874 after three.
As data accumulate the likelihood dominates, and the posterior concentrates around the values supported by the data for any reasonable prior.</p>
<p>Ex. 2, examples, advantages and limitations. The alarm of section 1 shows the influence of the prior: even a very accurate detector gives only a 16.7% probability of attack
after one alarm, because attacks are rare (the base rate fallacy); the same reasoning is used in spam filters, medical tests and fraud detection.
Section 2 estimates the success probability theta of an attack from k = 3 successes in n = 20 attempts. The likelihood alone has its maximum at 0.15;
with a flat prior Beta(1, 1) the posterior mean is 0.1818 with 95% interval [0.0544, 0.3634]; with the prior Beta(2, 18), which encodes previous experience of about 10% successes,
the posterior mean is 0.125 with interval [0.0429, 0.2421]. With few data the prior changes the conclusion noticeably, while a larger n brings the two posteriors closer.
The advantages are that prior knowledge is used explicitly, that the result is a probability statement about theta, that it works with small samples and updates naturally with new data.
The limitations are that the prior can be subjective and a wrong prior biases the results when data are few, that the likelihood model must be correct,
and that outside simple cases like the Beta-binomial the posterior needs numerical methods such as Monte Carlo sampling.</p>`,
    errSize: 'N must be between 10 and 1e5, m between 10 and 1e4, and N*m at most 2e7',
    tailC: 'with a 1 after n',
    theory: 'theory',
    tailTitle: N => `fraction of sequences with a 1 between n and N = ${N}, against n`,
    s1: 'p_n = 1/n',
    s2: 'p_n = 1/n^2',
    s3: 'P(X_n = 1) = 1/n',
    errProb: 'the probabilities must be strictly between 0 and 1, and the alarms between 1 and 20',
    alarmCol: 'alarm',
    before: 'P(A) before',
    pAl: 'P(alarm)',
    after: 'P(A) after',
    noAlarm: v => `with no alarm instead:  P(A | no alarm) = ${v}`,
    errBeta: 'a and b must be positive (at most 1e4), n between 1 and 1e5 and k between 0 and n',
    prior: (a, b, m) => `prior        Beta(${a}, ${b}),  mean ${m}`,
    mle: (k, n, v) => `likelihood   k = ${k} of n = ${n},  maximum at k/n = ${v}`,
    post: (a, b, m, lo, hi) => `posterior    Beta(${a}, ${b}),  mean ${m},  95% interval [${lo}, ${hi}]`,
    flat: (a, b, m, lo, hi) => `flat prior   Beta(1, 1) gives Beta(${a}, ${b}),  mean ${m},  95% interval [${lo}, ${hi}]`,
    densTitle: 'densities of theta',
    dPost: 'posterior',
    dLik: 'likelihood',
    dPrior: 'prior'
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
  },
  hw5: {
    title: 'HW5 - Riemann e Lebesgue, CDF normale',
    dl: 'scarica',
    h1: 'HW5 - integrazione di Riemann e di Lebesgue, calcolo numerico della CDF normale',
    hEx1: 'Es. 1 - integrazione di Riemann e di Lebesgue',
    intro1: `<p>Riemann: il dominio [a, b] viene diviso in N sottointervalli di ampiezza h, e l'integrale si approssima con h per la somma di f in un punto di ciascun sottointervallo,
il punto medio o un punto casuale. Lebesgue: il codominio di f viene diviso in K livelli di altezza d, ogni insieme di livello {x : y_j <= f(x) < y_j + d}, la controimmagine di un livello,
riceve il valore y_j del fondo del livello, e l'integrale si approssima con la somma di y_j per la misura della sua controimmagine.
Le misure sono stimate con S punti casuali, uno in ciascuna di S celle uguali del dominio.</p>
<p>Ogni numero in virgola mobile è razionale, quindi le funzioni di Dirichlet e di Thomae non si possono valutare alla lettera:
i punti medi (2i+1)/(2N) sono trattati come frazioni esatte p/q, mentre i punti casuali sono trattati come irrazionali, come lo sono con probabilità 1.</p>`,
    fnL: 'funzione',
    f0: 'sin(x), x in [0, pi]',
    f1: 'x^2, x in [0, 1]',
    f2: '1 se x < 0.5, 3 se x >= 0.5, x in [0, 1]',
    f3: '|x - 0.5|, x in [0, 1]',
    f4: '1/sqrt(x), x in (0, 1]',
    f5: '1 se x < 0.5, 0 se x >= 0.5, x in [0, 1]',
    f6: 'sin(x)/x, x in [0, pi]',
    f7: 'Dirichlet: 1 se x è razionale, 0 se irrazionale, x in [0, 1]',
    f8: 'Thomae: 1/q se x = p/q ridotta ai minimi termini, 0 se irrazionale, x in [0, 1]',
    run: 'esegui',
    hConv: '1. errore in funzione del numero di parti',
    convNote: 'scala logaritmica, nero: somma di Riemann con i punti medi in funzione di N, rosso: somma inferiore di Lebesgue in funzione di K con gli stessi S punti',
    hAll: '2. tutte le funzioni',
    allNote: "valori con N, K e S impostati sopra; la colonna esatto è l'integrale di Lebesgue (per Dirichlet l'integrale di Riemann non esiste)",
    hEx2: 'Es. 2 - calcolo numerico della CDF normale',
    intro2: `<p>Phi(x) = 1/2 + integrale da 0 a x di phi(t) dt, con phi(t) = exp(-t^2/2) / sqrt(2 pi). La pagina confronta quattro metodi:</p>
<pre>1. regola di Simpson     integrale di phi su [0, x] con n intervalli
2. serie di potenze erf  Phi(x) = 1/2 + 1/sqrt(2 pi) somma_k (-1)^k x^(2k+1) / (2^k k! (2k+1))
3. approssimazione erf   Phi(x) = (1 + erf(x/sqrt(2))) / 2, con erf dalla formula 7.1.26 di Abramowitz e Stegun
4. metodo proposto       |x| < 3:   Phi(|x|) = 1/2 + phi(x) somma_k |x|^(2k+1) / (1 * 3 * 5 * ... * (2k+1))
                         |x| >= 3:  1 - Phi(|x|) = phi(x) / (|x| + 1/(|x| + 2/(|x| + 3/(|x| + ...)))), 60 termini
                         e Phi(-x) = 1 - Phi(x)</pre>`,
    simpL: 'Simpson:',
    hRef: '1. confronto con il riferimento',
    refNote: 'riferimento: Phi(n) = (1 + P(|Z| <= n)) / 2, con i valori di P a 15 cifre della voce di Wikipedia "68-95-99.7 rule"; Simpson usa l\'n impostato sopra; gli errori sono valore meno riferimento',
    hEff: '2. accuratezza ed efficienza',
    effNote: "tempo per valutazione medio su 200 punti in [-7, 7] (dipende dal computer), ed errore assoluto massimo nei punti di riferimento; sotto, l'errore della regola di Simpson a x = 3 in funzione di n (scala logaritmica)",
    notesH: 'note',
    notes: `<p>Es. 1, le funzioni. La collezione è l'elenco della traccia: sette funzioni ordinarie e le due patologiche, Dirichlet e Thomae.
La sezione 2 riporta le tre approssimazioni di ogni integrale con i valori di default N = K = 1000 e S = 100000.</p>
<p>Es. 1, accuratezza e convergenza. Per le funzioni regolari la somma di Riemann con i punti medi converge come 1/N^2: per sin(x) l'errore è 8.2e-5, 8.2e-7 e 8.2e-9
con N = 100, 1000 e 10000. La somma inferiore di Lebesgue converge come 1/K e sempre dal basso, perché ogni insieme di livello riceve il valore del fondo del suo livello:
per sin(x) l'errore è -1.6e-2, -1.6e-3 e -1.6e-4 con K = 100, 1000 e 10000. Il suo errore dipende dall'altezza dei livelli, non da S:
con S = 1000000 e K = 10000 resta -1.6e-4.</p>
<p>Es. 1, efficienza computazionale. La somma di Riemann richiede N valutazioni di f: per sin(x) N = 1000 richiede circa 0.2 ms e dà un errore sotto 1e-6.
La somma di Lebesgue deve conoscere la misura di ogni controimmagine, cioè qui valutare f in S punti di tutto il dominio e distribuire i valori nei K livelli:
circa 10 ms con S = 100000, per un errore di 1.6e-3. Per arrivare a 1e-6 servirebbero circa un milione di livelli e almeno altrettanti punti.
Per le funzioni usuali l'approccio di Riemann è quindi molto più economico; quello di Lebesgue diventa economico solo quando le controimmagini sono note esattamente.</p>
<p>Es. 1, funzioni integrabili secondo Riemann. Per sin(x), x^2, le due funzioni a gradino, |x - 0.5|, sin(x)/x e la funzione di Thomae le tre colonne della sezione 2
coincidono con il valore esatto, e le differenze tendono a zero al crescere di N e K: i due approcci convergono allo stesso valore, come dice la teoria
(quando l'integrale di Riemann esiste, è uguale all'integrale di Lebesgue).</p>
<p>Es. 1, funzioni per cui i due approcci si comportano diversamente.
Le funzioni a gradino sono funzioni semplici, quindi la somma di Lebesgue è esatta per ogni K, mentre la somma di Riemann è esatta solo quando un punto della partizione cade in 0.5:
con N = 101 l'errore è 9.9e-3 per il gradino 1/3. |x - 0.5| è simile: la regola del punto medio è esatta per N pari, ma con N = 101 l'errore è 2.5e-5.
1/sqrt(x) è illimitata, quindi il suo integrale di Riemann esiste solo come integrale improprio: le somme con i punti medi convergono lentamente, come 1/sqrt(N)
(errori 6.0e-2, 1.9e-2 e 6.0e-3 con N = 100, 1000 e 10000), e la somma di Lebesgue con livelli uguali va ancora peggio, perché il codominio
va da 1 a diverse centinaia e i livelli sono grossolani (errori 0.70, 0.18 e 0.022 con K = 100, 1000 e 10000).
La funzione di Dirichlet mostra la vera differenza: le somme di Riemann con punti razionali danno 1 per ogni N e con punti irrazionali danno 0,
quindi non convergono e l'integrale di Riemann non esiste, mentre per Lebesgue i razionali sono numerabili, hanno misura 0, e l'integrale è 0.
La funzione di Thomae è integrabile secondo Riemann con integrale 0, ma le somme di Riemann con punti razionali si avvicinano a 0 lentamente (1.3e-2, 1.7e-3 e 2.1e-4 con N = 100, 1000 e 10000),
mentre la somma di Lebesgue dà subito 0, perché f vale 0 fuori da un insieme di misura 0.</p>
<p>Es. 2, il metodo. Il metodo proposto (metodo 4) usa la serie Phi(x) = 1/2 + phi(x) (x + x^3/3 + x^5/(3*5) + ...) per |x| &lt; 3.
Tutti i suoi termini sono positivi, quindi non ci sono cancellazioni, e servono al massimo 33 termini. Per |x| >= 3 usa la frazione continua di Laplace,
che dà direttamente la coda 1 - Phi(x), così le piccole probabilità nelle code mantengono la loro precisione relativa. Da x = 3 in poi bastano 60 termini.</p>
<p>Es. 2, confronto con il riferimento. I valori di riferimento sono Phi(n) = (1 + P(|Z| &lt;= n)) / 2 per n = 0, ..., 7, con P preso dalla voce di Wikipedia
"68-95-99.7 rule", che lo riporta con 15 decimali, quindi il riferimento stesso è accurato a circa 5e-16. Il metodo 4 coincide con ogni valore di riferimento entro 3.3e-16,
quindi il suo errore è al livello del riferimento e della doppia precisione.</p>
<p>Es. 2, accuratezza ed efficienza degli approcci. I tempi sono misurati nel browser sul computer usato per l'homework.
La regola di Simpson con n = 100 ha un errore massimo di 3.6e-10 e richiede circa 1.8 microsecondi per valore, perché valuta phi n + 1 volte;
il suo errore cala come 1/n^4 (sezione 2): a x = 3 è 3.6e-10 con n = 100 e 3.6e-14 con n = 1000.
La serie di potenze di erf è esatta per x piccoli, ma i suoi termini hanno segno alterno e diventano molto più grandi del risultato (circa 2e8 a x = 7),
quindi gli errori di arrotondamento vengono amplificati: l'errore passa da 1e-16 per x &lt;= 3 a 3.6e-8 a x = 7. L'approssimazione di erf di Abramowitz e Stegun è la più veloce,
circa 0.05 microsecondi, ma il suo errore è fissato dalla formula (fino a 1.5e-7 per erf) e arriva a 6.9e-8 nei punti di riferimento.
Il metodo 4 richiede tra 0.2 e 0.3 microsecondi ed è accurato alla doppia precisione ovunque, quindi è il più efficiente dei quattro a piena precisione.</p>
<p>Es. 2, perché Phi non è elementare. Phi è una primitiva di phi(x) = exp(-x^2/2) / sqrt(2 pi). Il teorema di Liouville (1835) dà un criterio per
gli integrali della forma f(x) exp(g(x)) con f e g razionali: la primitiva è una funzione elementare solo se esiste una funzione razionale R con f = R' + R g'.
Qui f = 1 e g = -x^2/2, quindi R dovrebbe soddisfare R' - x R = 1. Se R è un polinomio di grado d, R' - x R ha grado d + 1 >= 1 e non può essere la costante 1.
Se R ha un polo di ordine m in un punto, lì R' ha un polo di ordine m + 1 e x R uno di ordine al più m, quindi R' - x R ha ancora un polo.
Non esiste alcuna R razionale, quindi exp(-x^2/2) non ha una primitiva elementare, e Phi non si può scrivere come combinazione finita di polinomi, esponenziali, logaritmi,
radici e funzioni trigonometriche.</p>
<p>Es. 2, la funzione d'errore. erf(x) = 2/sqrt(pi) per l'integrale da 0 a x di exp(-t^2) dt è definita come nuova funzione proprio per dare un nome a questo integrale,
e con essa la CDF ha una forma chiusa esatta, Phi(x) = (1 + erf(x / sqrt(2))) / 2. Questo sposta il problema ma non lo risolve numericamente:
anche erf non è elementare, quindi i suoi valori vanno comunque calcolati con serie, frazioni continue o approssimazioni razionali, ed è quello che fanno le librerie
(JavaScript non ha nemmeno una erf predefinita). I metodi 2, 3 e 4 sono proprio calcoli di questo tipo, e il metodo 1 torna all'integrale stesso.</p>`,
    errSize: 'N e K devono essere tra 1 e 1e6, S tra 10 e 2e6',
    head: (name, I) => `${name},  integrale esatto = ${I}`,
    dirNote: "l'integrale di Riemann non esiste: 0 è l'integrale di Lebesgue",
    sqrtNote: "f è illimitata, quindi 2 è un integrale di Riemann improprio",
    value: 'valore',
    error: 'errore',
    evals: 'valut. f',
    ms: 'ms',
    rMid: N => `Riemann, punti medi, N = ${N}`,
    rRand: N => `Riemann, punti casuali, N = ${N}`,
    leb: (K, S) => `Lebesgue, K = ${K}, S = ${S}`,
    convTitle: 'errore assoluto in funzione del numero di parti (1e-16 = esatto)',
    convR: 'Riemann, N sottointervalli',
    convL: S => `Lebesgue, K livelli, S = ${S}`,
    exact: 'esatto',
    colMid: 'R. punti medi',
    colRand: 'R. casuali',
    colLeb: 'Lebesgue',
    errX: 'x deve essere un numero e n tra 2 e 1e6',
    diff: 'meno m. 4',
    terms: 'termini',
    m1: '1. Simpson',
    m2: '2. serie di potenze erf',
    m3: '3. approssimazione erf (A&S)',
    m4: '4. metodo proposto',
    refCol: 'riferimento',
    m4s: 'metodo 4',
    m2s: 'serie',
    usPer: 'us / valut.',
    maxErr: 'errore max',
    simpTitle: 'regola di Simpson, errore assoluto a x = 3 in funzione di n',
    simpName: 'misurato'
  },
  hw6: {
    title: 'HW6 - indipendenza statistica',
    dl: 'scarica',
    h1: 'HW6 - indipendenza statistica: tabella di contingenza e test del chi-quadro',
    intro: 'Il dataset è una lista di record (x, f), uno per riga. Di default è un campione simulato di n attacchi: X è il tipo di attacco e F il suo esito, con probabilità degli esiti che dipendono dal tipo di attacco. Nel riquadro qui sotto si può incollare qualsiasi altro dataset.',
    gen: 'genera',
    dataL: 'record (x, f), uno per riga, separati da virgola, punto e virgola o tab',
    run: 'calcola',
    hTab: '1. tabella di contingenza e frequenze marginali',
    tabNote: 'frequenze assolute osservate n_ij, totali di riga e di colonna n_i. e n_.j, e frequenze relative marginali n_i./n e n_.j/n',
    hCond: '2. frequenze condizionate',
    condNote: 'sopra: distribuzione di F per ogni valore di X, n_ij / n_i.; sotto: distribuzione di X per ogni valore di F, n_ij / n_.j; grafico: la prima tabella, una barra per ogni valore di X e una per la marginale di F',
    hExp: '3. frequenze attese in caso di indipendenza e chi-quadro',
    expNote: 'frequenze attese E_ij = n_i. n_.j / n, e il contributo (n_ij - E_ij)^2 / E_ij di ogni cella alla statistica chi-quadro',
    notesH: 'note',
    notes: `<p>Tabella di contingenza e frequenze. La pagina legge i record, raccoglie i valori di X e di F e conta quanti record cadono in ogni coppia (x_i, f_j):
questi conteggi n_ij formano la tabella di contingenza della sezione 1. I totali di riga e di colonna divisi per n sono le frequenze marginali di X e di F,
e dividendo ogni conteggio per il suo totale di riga o di colonna si ottengono le frequenze condizionate della sezione 2.
Con i dati di default il 29.6% di tutti gli attacchi finisce con una compromissione, ma la frequenza condizionata è del 46.5% per il phishing e del 9.5% per il brute force.</p>
<p>Frequenze attese e chi-quadro. Se X e F fossero indipendenti, la frequenza attesa di ogni cella sarebbe E_ij = n_i. n_.j / n (sezione 3).
La statistica chi^2 = somma su tutte le celle di (n_ij - E_ij)^2 / E_ij misura quanto la tabella osservata si allontana da questi valori.
Con i dati di default chi^2 = 79.574 con (4-1)(3-1) = 6 gradi di libertà, e il p-value è 4.37e-15.
I contributi maggiori vengono dal phishing (21.0 per compromised e 15.8 per blocked) e dal brute force (14.9 per blocked e 13.0 per compromised).
La frequenza attesa più piccola è 15.72, sopra 5, quindi l'approssimazione del chi-quadro è affidabile.</p>
<p>Indipendenza in probabilità. Due eventi A e B sono indipendenti quando P(A e B) = P(A) P(B), che equivale a P(A | B) = P(A): sapere che B è avvenuto
non cambia la probabilità di A. Due variabili aleatorie X e F sono indipendenti quando P(X = x, F = f) = P(X = x) P(F = f) per ogni coppia di valori,
quindi la distribuzione condizionata di F è la stessa per ogni valore di X ed è uguale alla distribuzione marginale di F.</p>
<p>Indipendenza in statistica. Sui dati osservati la stessa idea si scrive con le frequenze relative: X e F sono statisticamente indipendenti nel campione
quando n_ij / n = (n_i. / n)(n_.j / n) per ogni cella, cioè quando n_ij = E_ij e tutte le righe della tabella condizionata f(F | X) sono uguali alla marginale di F.
In un campione reale questo non succede mai esattamente, anche quando le variabili sono indipendenti in probabilità, a causa delle fluttuazioni casuali.
Il test del chi-quadro decide se le differenze sono troppo grandi per essere fluttuazioni: nell'ipotesi di indipendenza chi^2 segue approssimativamente
una distribuzione chi-quadro con (r-1)(c-1) gradi di libertà, che qui ha media 6 e supera 12.59 solo nel 5% dei casi.</p>
<p>Interpretazione. Il valore osservato chi^2 = 79.574 è molto sopra 12.59, e il p-value 4.37e-15 significa che una tabella così lontana dall'indipendenza
non comparirebbe quasi mai se X e F fossero indipendenti. L'indipendenza viene rifiutata: l'esito di un attacco dipende dal suo tipo. La tabella condizionata mostra come:
il phishing porta a una compromissione molto più spesso della media (46.5% contro 29.6%), mentre il brute force viene bloccato nel 70.5% dei casi contro una media del 44.2%.
Questo è coerente con il modo in cui i dati sono stati simulati, con probabilità degli esiti che cambiano con il tipo di attacco.
Un p-value grande non dimostrerebbe l'indipendenza, significherebbe solo che i dati non mostrano una dipendenza.</p>
<p>Associazione e causalità. Il test mostra un'associazione tra tipo di attacco ed esito, non la sua causa, e non indica nemmeno una direzione.
Il phishing potrebbe riuscire più spesso perché colpisce le persone invece dei sistemi, ma la stessa tabella comparirebbe anche se le organizzazioni che ricevono
più phishing avessero difese più deboli (una terza variabile che influenza entrambe), oppure se venissero registrati solo alcuni esiti (per esempio solo gli attacchi rilevati).
Per affermare che il tipo di attacco causa l'esito serve un esperimento controllato, in cui il tipo viene assegnato a caso, oppure un modello causale che tenga conto
delle altre variabili. La dipendenza statistica è necessaria per un effetto causale, ma non sufficiente.</p>`,
    errN: 'n deve essere tra 10 e 100000',
    errData: 'i dati devono contenere almeno due valori di X e due valori di F',
    head: (n, r, c, bad) => `${n} record, ${r} valori di X, ${c} valori di F` + (bad ? `, righe scartate: ${bad}` : ''),
    chi: (x, df) => `chi-quadro = ${x},  gradi di libertà (r-1)(c-1) = ${df}`,
    pval: p => `p-value = P(chi2 > osservato) = ${p}`,
    minE: v => `frequenza attesa più piccola = ${v}`,
    warnE: "(sotto 5: l'approssimazione del chi-quadro non è affidabile)",
    dep: "p < 0.05: l'indipendenza viene rifiutata, X e F sono dipendenti",
    indep: "p >= 0.05: i dati sono compatibili con l'indipendenza",
    total: 'totale',
    marg: 'marginale',
    condF: 'f(F | X) = n_ij / n_i.',
    condX: 'f(X | F) = n_ij / n_.j',
    expT: 'frequenze attese E_ij',
    contT: 'contributi (n_ij - E_ij)^2 / E_ij',
    barsTitle: 'f(F | X) per ogni valore di X, e la marginale di F'
  },
  hw7: {
    title: 'HW7 - convergenza e Bayes',
    dl: 'scarica',
    h1: 'HW7 - modi di convergenza, probabilità condizionata e teorema di Bayes',
    hEx1: 'Ex. 1 - modi di convergenza nella teoria della probabilità',
    defs: `<p>Siano X_1, X_2, ... e X variabili aleatorie definite sullo stesso spazio di probabilità. I quattro principali modi di convergenza di X_n a X sono:</p>
<pre>quasi certa (q.c.)        P(lim X_n = X) = 1
in probabilità            per ogni e > 0:  P(|X_n - X| > e) -> 0
in media quadratica (L^2) E[(X_n - X)^2] -> 0
in distribuzione          F_n(x) -> F(x) in ogni punto x in cui F è continua

relazioni                 q.c.  => in probabilità => in distribuzione
                          L^2   => in probabilità  (Chebyshev: P(|X_n - X| > e) <= E[(X_n - X)^2] / e^2)
                          in distribuzione a una costante c => in probabilità a c</pre>`,
    hBc: '1. in probabilità ma non quasi certamente',
    bcNote: 'X_1, X_2, ... sono indipendenti, X_n = 1 con probabilità p_n e 0 altrimenti. Poiché P(X_n = 1) = p_n -> 0 (linea blu), X_n -> 0 in probabilità, e anche in media quadratica perché E[X_n^2] = p_n. La convergenza quasi certa richiede che, in quasi ogni successione, tutti i valori siano 0 da un certo indice in poi. Per i lemmi di Borel-Cantelli questo succede con probabilità 1 se la somma dei p_n è finita (p_n = 1/n^2, rosso) e con probabilità 0 se è infinita (p_n = 1/n, nero). La tabella e il grafico danno, per ogni n, la frazione delle m successioni simulate che hanno ancora un 1 tra n e N (punti) e il suo valore esatto (linee).',
    run: 'esegui',
    hEx2: 'Ex. 2 - probabilità condizionata, teorema di Bayes e inferenza statistica',
    bayes: `<p>Probabilità condizionata: P(A | B) = P(A e B) / P(B), per P(B) > 0. Scrivendo P(A e B) nei due modi possibili si ottiene il teorema di Bayes,
qui per una quantità ignota theta e i dati osservati x:</p>
<pre>P(theta | x) = P(x | theta) P(theta) / P(x),     P(x) = somma (o integrale) su theta di P(x | theta) P(theta)
posterior    = verosimiglianza * prior / evidenza</pre>`,
    hAlarm: '1. un esempio discreto: un allarme di intrusione',
    alarmNote: "A = è in corso un attacco. La prior P(A) è il tasso di base degli attacchi; la verosimiglianza è data dal tasso di rilevamento P(allarme | A) e dal tasso di falsi allarmi P(allarme | non A). La tabella applica il teorema di Bayes dopo ogni allarme, usando la posterior di un passo come prior del successivo (allarmi indipendenti dato A o non A).",
    priorL: 'prior P(A)',
    sensL: 'P(allarme | A)',
    fprL: 'P(allarme | non A)',
    kL: 'allarmi',
    hBeta: '2. un esempio continuo: prior Beta e verosimiglianza binomiale',
    betaNote: "theta = probabilità che un attacco a un sistema riesca. Prior Beta(a, b), con media a/(a+b); dati: k successi in n attacchi, con verosimiglianza binomiale proporzionale a theta^k (1-theta)^(n-k); la posterior è ancora una Beta, Beta(a + k, b + n - k). L'intervallo è l'intervallo di credibilità centrale al 95%. Grafico: nero posterior, rosso verosimiglianza (normalizzata ad area 1), blu prior.",
    dataL: 'dati:',
    notesH: 'note',
    notes: `<p>Ex. 1, differenze tra i modi. La convergenza quasi certa riguarda le singole successioni: con probabilità 1 la successione di numeri X_n(omega) converge a X(omega).
La convergenza in probabilità chiede solo che, per ogni n grande fissato, uno scarto |X_n - X| > e sia improbabile; scarti grandi e rari possono continuare a comparire per n diversi, quindi è più debole.
La convergenza in media quadratica chiede che la distanza quadratica media E[(X_n - X)^2] tenda a 0; per la disuguaglianza di Chebyshev implica la convergenza in probabilità,
ma richiede momenti secondi finiti e non è implicata dalla convergenza quasi certa (X_n = n con probabilità 1/n^2 e 0 altrimenti tende a 0 quasi certamente, ma E[X_n^2] = 1).
La convergenza in distribuzione riguarda solo le funzioni di ripartizione, non i valori: se Z è N(0,1), la successione X_n = -Z converge in distribuzione a Z,
anche se |X_n - Z| = 2|Z| non diventa mai piccolo. Quindi la convergenza quasi certa e quella in media quadratica implicano ciascuna la convergenza in probabilità, che implica quella in distribuzione,
e in generale le implicazioni inverse sono false. La sezione 1 mostra una successione che converge in probabilità e in media quadratica ma non quasi certamente:
con p_n = 1/n la frazione di successioni che hanno ancora un 1 dopo n = 1000 è 0.898 (valore esatto 0.900 con N = 10000, e tende a 1 al crescere di N),
mentre con p_n = 1/n^2 è già 0.097 dopo n = 10 e 0.007 dopo n = 100.</p>
<p>Ex. 1, ruolo nella LGN, nel TLC e in altri risultati. Per X_i i.i.d. con media mu, la legge debole dei grandi numeri afferma che la media campionaria S_n/n converge a mu in probabilità;
quando la varianza sigma^2 è finita segue da E[(S_n/n - mu)^2] = sigma^2/n, quindi la convergenza è anche in media quadratica.
La legge forte (Kolmogorov) afferma la convergenza quasi certa e richiede solo E|X| finito: quasi ogni singola successione di medie si stabilizza su mu,
ed è questo che giustifica la stima di mu da un solo campione lungo, come negli HW3 e HW4.
Il teorema del limite centrale è un enunciato in distribuzione: (S_n - n mu) / (sigma sqrt(n)) converge in distribuzione a N(0, 1), e non converge in probabilità,
perché la somma standardizzata continua a fluttuare con varianza 1 invece di stabilizzarsi su un valore.
Altri risultati usano gli stessi modi: la consistenza di uno stimatore è la convergenza in probabilità al vero parametro, il teorema di Glivenko-Cantelli dà la convergenza quasi certa
e uniforme della funzione di ripartizione empirica, e la normalità asintotica degli stimatori, il teorema di Slutsky e il metodo delta sono enunciati in distribuzione,
ed è questo che usano gli intervalli di confidenza e i test.</p>
<p>Ex. 1, perché sqrt(n). Per una somma S_n = X_1 + ... + X_n, Var(S_n) è la somma delle varianze più due volte la somma delle covarianze.
Se le X_i sono indipendenti, o anche solo incorrelate, le covarianze sono 0 e le varianze si sommano: Var(S_n) = n sigma^2, quindi la deviazione standard della somma cresce come sqrt(n), non come n.
Dividendo per n si ottiene Var(S_n/n) = sigma^2/n, che tende a 0 (legge dei grandi numeri); dividendo per sqrt(n) si ottiene una varianza che resta sigma^2,
l'unica scala in cui può esistere un limite non degenere (teorema del limite centrale).
Nell'inferenza statistica lo stesso fatto dà l'errore standard sigma/sqrt(n) della media: gli intervalli di confidenza si restringono come 1/sqrt(n), quindi con il quadruplo dei dati la loro ampiezza si dimezza,
come misurato negli HW3 e HW4. È l'indipendenza che fa funzionare tutto questo: con dati correlati positivamente le covarianze si sommano e la varianza della media cala più lentamente
(con n copie identiche non cala affatto), quindi le formule che assumono sqrt(n) sarebbero troppo ottimiste.</p>
<p>Ex. 2, probabilità condizionata. Nella teoria della probabilità P(A | B) = P(A e B) / P(B) è la probabilità di A nel mondo ristretto in cui B è avvenuto;
da essa seguono la regola del prodotto P(A e B) = P(A | B) P(B), la legge della probabilità totale P(A) = somma di P(A | B_i) P(B_i) e la definizione di indipendenza, P(A | B) = P(A).
In statistica il condizionamento è il modo in cui entrano i dati: le frequenze relative all'interno di un gruppo (le tabelle condizionate dell'HW6) stimano probabilità condizionate,
e ogni modello dà la probabilità dei dati dati i parametri, P(x | theta). L'inferenza frequentista tiene theta fisso e studia i dati dato theta;
l'inferenza bayesiana condiziona anche nell'altra direzione, sui dati osservati, e dà P(theta | x).</p>
<p>Ex. 2, prior, verosimiglianza e posterior. La prior P(theta) è la distribuzione della quantità ignota prima di vedere i dati.
La verosimiglianza L(theta) = P(x | theta) è la probabilità dei dati osservati per ogni possibile valore di theta, letta come funzione di theta (non è una distribuzione su theta).
La posterior P(theta | x) è la distribuzione di theta dopo i dati. Il teorema di Bayes le collega: posterior = verosimiglianza * prior / P(x),
quindi la posterior è proporzionale a verosimiglianza per prior, e l'evidenza P(x) serve solo a farla sommare o integrare a 1.
I valori di theta plausibili a priori e che spiegano bene i dati ricevono una probabilità a posteriori alta.</p>
<p>Ex. 2, perché l'aggiornamento è centrale. La posterior riassume tutto quello che i dati dicono su theta, dati il modello e la prior, e si usa direttamente:
stime puntuali (media a posteriori), intervalli di credibilità, probabilità di ipotesi e decisioni. Quando arrivano nuovi dati indipendenti, la posterior attuale diventa la nuova prior
e si applica di nuovo il teorema di Bayes, con lo stesso risultato che si avrebbe usando tutti i dati insieme. La sezione 1 fa proprio questo: con un tasso di base dell'1%, un tasso di rilevamento del 99%
e il 5% di falsi allarmi, la probabilità di attacco passa da 0.01 a 0.1667 dopo un allarme, 0.7984 dopo due e 0.9874 dopo tre.
Man mano che i dati si accumulano la verosimiglianza prevale, e la posterior si concentra attorno ai valori sostenuti dai dati per qualsiasi prior ragionevole.</p>
<p>Ex. 2, esempi, vantaggi e limiti. L'allarme della sezione 1 mostra l'influenza della prior: anche un rilevatore molto accurato dà solo il 16.7% di probabilità di attacco
dopo un allarme, perché gli attacchi sono rari (la fallacia del tasso di base); lo stesso ragionamento si usa nei filtri antispam, nei test medici e nel rilevamento delle frodi.
La sezione 2 stima la probabilità di successo theta di un attacco da k = 3 successi su n = 20 tentativi. La verosimiglianza da sola ha il massimo in 0.15;
con una prior piatta Beta(1, 1) la media a posteriori è 0.1818 con intervallo al 95% [0.0544, 0.3634]; con la prior Beta(2, 18), che rappresenta un'esperienza precedente di circa il 10% di successi,
la media a posteriori è 0.125 con intervallo [0.0429, 0.2421]. Con pochi dati la prior cambia in modo evidente la conclusione, mentre con n più grande le due posterior si avvicinano.
I vantaggi sono che la conoscenza a priori si usa in modo esplicito, che il risultato è un'affermazione di probabilità su theta, che funziona con campioni piccoli e si aggiorna in modo naturale con nuovi dati.
I limiti sono che la prior può essere soggettiva e una prior sbagliata distorce i risultati quando i dati sono pochi, che il modello di verosimiglianza deve essere corretto,
e che al di fuori di casi semplici come il Beta-binomiale la posterior richiede metodi numerici come il campionamento Monte Carlo.</p>`,
    errSize: 'N deve essere tra 10 e 1e5, m tra 10 e 1e4, e N*m al massimo 2e7',
    tailC: 'con un 1 dopo n',
    theory: 'teoria',
    tailTitle: N => `frazione di successioni con un 1 tra n e N = ${N}, in funzione di n`,
    s1: 'p_n = 1/n',
    s2: 'p_n = 1/n^2',
    s3: 'P(X_n = 1) = 1/n',
    errProb: 'le probabilità devono essere strettamente tra 0 e 1, e gli allarmi tra 1 e 20',
    alarmCol: 'allarme',
    before: 'P(A) prima',
    pAl: 'P(allarme)',
    after: 'P(A) dopo',
    noAlarm: v => `se invece non c'è allarme:  P(A | nessun allarme) = ${v}`,
    errBeta: 'a e b devono essere positivi (al massimo 1e4), n tra 1 e 1e5 e k tra 0 e n',
    prior: (a, b, m) => `prior            Beta(${a}, ${b}),  media ${m}`,
    mle: (k, n, v) => `verosimiglianza  k = ${k} su n = ${n},  massimo in k/n = ${v}`,
    post: (a, b, m, lo, hi) => `posterior        Beta(${a}, ${b}),  media ${m},  intervallo al 95% [${lo}, ${hi}]`,
    flat: (a, b, m, lo, hi) => `prior piatta     Beta(1, 1) dà Beta(${a}, ${b}),  media ${m},  intervallo al 95% [${lo}, ${hi}]`,
    densTitle: 'densità di theta',
    dPost: 'posterior',
    dLik: 'verosimiglianza',
    dPrior: 'prior'
  }
}
}
