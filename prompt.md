This stub application is to be web only application (ie front-end with no backend).                                                         
                                                                                                                                              
The application is to provide the ability to share secrets and confidential information (text only currently) via URL link. The information   
to be shared is to be encoded using a public key and decoded using a private key. The encoded content shared is transmitted via the URL       
(query string - or alternative if a better alternative is possible).                                                                          
                                                                                                                                              
The application is to provide 4 sections within the page:                                                                                     
- Section 1: Introduction. This section provides a narrative on how to use the application, its design and limitations.                       
- Section 2: Key generation. This section is used to generate the public and private keys for a user. The user should be able to download the 
 private key locally for later reuse. The user should be able to copy a URL where the public key is encoded in the query string. This URL     
should redirect a different user to section 3 with the public key provided in URL.                                                            
- Section 3: Document encoding. This section is used to allow a different user (user 2) to encode a document using the public key of user 1   
(the intended recipients of the document). The public key of user 1 is provided as a query string URL. In this section, user 2 can enter text 
 into a multiline text area. When click the button "encode", the page should encode the provided text using the public key specified in the   
URL query string and output a URL that point to Section 4 with the encoded content provided as a query string. User 2 then send this link to  
user 1.                                                                                                                                       
- Section 4: Document decoding. This section allow user 1 (the intended recipient of the document) to decode the document. This section is    
loaded by clicking on the URL sent by user 2. Then user 1 upload his locally saved private key and then click "decode". The page should       
decode the encoded content (provided in the URL query) string using the private key.                                                          
                                                                                                                                              
The user journey is as follows:                                                                                                               
                                                                                                                                              
- User 1 navigate to section 2.                                                                                                               
- User 1 generates new public and private keys                                                                                                
- User 1 save private key locally                                                                                                             
- User 1 send URL with public key to User 2                                                                                                   
- User 2 navigate (via the URL) to Section 3                                                                                                  
- User 2 enter the text information to be encoded                                                                                             
- User 2 click on "encode"                                                                                                                    
- User 2 send the URL with the encoded content to User 1                                                                                      
- User 1 navigate (via the URL) to Section 4                                                                                                  
- User 1 upload his/her locally saved private key                                                                                             
- User 1 click on "decode"                                                                                                                    
- User 1 can read decoded content shared by User 2 
