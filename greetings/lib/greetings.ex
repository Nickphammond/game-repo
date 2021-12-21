defmodule Greetings do

  nameArray = ["Mike", "Kristina", "Justin", "Josh", "Olivia", "Rebecca", "Nick", "Jeff", "Kathryn", "Paul", "Rob", "Clem", "Will", "Jeremy", "Mark", "Thomas"]

  def teamMembers do
    ["Jeff", "Kathryn", "Paul", "Martin"]
  end

  def stringEqualilty(string1, string2) do
    string1 === string2
  end

  def stringEquality(string2), do: fn(string1) -> stringEqualilty(string1, string2) end

  def hashString(string) do
    :crypto.mac(:hmac, :sha256, "key", string)
    |> Base.encode16
  end

  def validateString(string) do
    string
    |> hashString
    |> stringEqualilty("E1622B75CA5762C9FAEBF6DA6CC959DDEA60ED1428804A3094C4BF8B8F3A108F")
  end

  def validateTeamMembers() do
    verify = (Enum.join(Enum.sort(teamMembers()), " ") |> hashString)
    IO.puts(verify)
    cond do
      verify == "3C020CE321B152F880D35D22B99404F33ED04F54A4DCA91810734D6B35C2A639" ->
        true
      verify == "247D3B9F1B7FD25AAF05E6FE0AE8E29964C0213A7E79BF4D34D87B2CD600DFFE" ->
        true
      verify == "0506E7B869267F2F5781748130617A964CDA224102BF6749CCCE393263BD8765" ->
        true
      verify == "077B54B274616AE5213C8496D49F0E4658371216EDD82A96F0BAE6321538464C" ->
        true
      verify == "1879C1C9889913DCE7B1184D90ECB117DBAFCA7C9D0D5D2C388B373BB7A96F92" ->
        true
      verify == "ADB6DAAAEB1175571DA844F1D06AE0BDBDA9924F0CB16A635292924D90A076BA" ->
        true
      verify == "8829CF3942E13C8FB45B6F20CED6BBAB4A867BC3338A37649E8DFF78DA4D6583" ->
        true
      verify == "ED20AEB82F5916C6A4BD6BEACD311D051474C8C6C28A388AC07AEA50C5858164" ->
        true
      true ->
        false
    end
  end

  ## poem functions

  def putOnYourGear(x) do
    validateString(x)
  end

  def findYourTeam(true) do
    validateTeamMembers()
  end

  def findYourTeam(false) do
    IO.inspect("Did you type in the message from the Xmas card EXACTLY?")
  end

  def pickAName(true) do
    IO.puts("You found your team mates! Talk to your team mates and choose a name and give it to administrators. Then paste the secret key they give you into the code")
    # putSecretKeyHere:

  end

  def pickAName(false) do
    IO.inspect("No dice. You haven't guessed your team mates correctly")
    :error
  end

  def unlockTheGame(secretKey) do
    algo = :aes_256_cbc
    a = :crypto.hash(:md5, secretKey)
    b = :crypto.hash(:md5, a <> secretKey)
    c = :crypto.hash(:md5, b <> secretKey)
    iv = a <> b
    key = c
    # code to start the ctf
    encoded_ciphertext = "d0e7c38d17be00bde6e34e5167d1fc33c1b424f0c10a17ea0cadd131f6406239"
    ciphertext = Base.decode16!(encoded_ciphertext, case: :lower)
    :crypto.crypto_one_time(algo, iv, key, ciphertext, [encrypt: false, padding: :pkcs_padding])
    |> IO.inspect()
  end

  def begin() do
    "Your time at Alembic is appreciated, so take these gifts and some $$ and don't @depricated"
    |> putOnYourGear
    |> findYourTeam
    |> pickAName
    |> unlockTheGame
  end

end
