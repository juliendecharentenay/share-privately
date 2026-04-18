# Share Privately

*Share Privately* is a single page web application to allow a user to share text over an untrusted channel using asymmetric encryption. No account, no server as everything happens inside the browser and the one page.

**NOTE**
This project was developed using Claude Code with the prompt shown in the [prompt.md](/prompt.md). I reviewed and edited the code. Validation and discussion is shown below.

## Project Setup
Requirements: Node v25 or above

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

No unit tests are currently implemented.

```sh
npm run test:unit
```
## Review and Validation

### Encryption/Decryption

The method of encryption/decryption was not nominated in the prompt, but a requirement was for encryption/decryption to occur in the browser. I thought I had prescribed for all encryption/decryption to be done in a single file `crypto.js` - as is implemented - but I do not seem to have this requirement appearing in the prompt.

Claude Code used an [hybrid cryptosystem](https://en.wikipedia.org/wiki/Public-key_cryptography#Hybrid_cryptosystems) where a public/private asymetric key to encrypt a symmetric key. The choice of encryption algorithm - namely RSA-OAEP (asymetric encryption) and AES-GCM (symmetric encryption) - were done by Claude Code. 

To validate the application and process, I replicated the encryption and decryption using linux commands available from the command prompt (to the exception of using python for the symmetric encryption).

Generate the private and public keys as follows:
```
openssl genpkey -algorithm RSA -out private_key.pem
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

Generate the encryption URL as follows:
```
uri_pk=$(cat public_key.pem | grep -v 'BEGIN\|END' | tr -d '\n' | jq -Rr @uri)
echo "https://share-private.charentenay.me/?pk=$uri_pk"
```

Encrypt the text (specify in the variable `text` below):
```
# Make sure that the file `public_key.pem` is available in the current directory
# Text to encrypt goes in here:
text="Hello world"

# Generate AES key and IV
aesKey=$(openssl rand 32 | base64)
iv=$(openssl rand 12 | base64)

# Generate cypher binary
cypherText=$(python3 - <<EOF
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64
import sys

key = base64.b64decode("$aesKey")
iv = base64.b64decode("$iv")
plaintext = """$text""".encode()

aesgcm = AESGCM(key)

# Encrypt (returns ciphertext + tag)
ciphertext = aesgcm.encrypt(iv, plaintext, None)

# Output as base64
print(base64.b64encode(ciphertext).decode())
EOF
)

# RSA encrypt key
echo "$aesKey" | base64 --decode | openssl pkeyutl -encrypt \
  -pubin -inkey public_key.pem \
  -pkeyopt rsa_padding_mode:oaep \
  -pkeyopt rsa_oaep_md:sha256 \
  -pkeyopt rsa_mgf1_md:sha256 > enc_key.bin
ek=$(base64 -w 0 enc_key.bin)

uri_ec=$(echo $cypherText | jq -Rr @uri)
uri_ek=$(echo $ek | jq -Rr @uri)
uri_iv=$(echo $iv | jq -Rr @uri)
echo "https://share-privately.charentenay.me/?ec=$uri_ec&ek=$uri_ek&iv=$uri_iv"
```

Decrypt encoded text
```
# Copy encoded url into file `encoded_url`
# echo '' > encoded_url

ec=$(cat encoded_url | sed -e 's/^.*ec=//' | sed -e 's/&.*$//' | nkf --url-input)
ek=$(cat encoded_url | sed -e 's/^.*ek=//' | sed -e 's/&.*$//' | nkf --url-input)
iv=$(cat encoded_url | sed -e 's/^.*iv=//' | sed -e 's/&.*$//' | nkf --url-input)
aesKey=$(echo "$ek" | base64 --decode | openssl pkeyutl -decrypt -inkey private_key.pem -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 -pkeyopt rsa_mgf1_md:sha256 | base64)

python3 - <<EOF
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64

key = base64.b64decode("$aesKey")
iv = base64.b64decode("$iv")
data = base64.b64decode("$ec")

ciphertext = data[:-16]
tag = data[-16:]

aesgcm = AESGCM(key)
plaintext = aesgcm.decrypt(iv, ciphertext + tag, None)

print(plaintext)
EOF
```

## References
[1] [Common Public Key Standards and Their Use with OpenSSL](https://www.putzisan.com/articles/common-public-key-standards)
[2] [Stack Overflow: encrypt small text using openssl](https://stackoverflow.com/questions/67648523/how-to-encrypt-a-small-text-using-openssl-with-a-given-public-key)


