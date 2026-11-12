HOW TO ADD A SONG  (no code changes, no rebuild needed for the list)
=====================================================================

1. Put the audio file in this folder, named  <id>.mp3
      e.g.  tum-hi-ho.mp3

2. Add one line for it in  songs.json  (same folder):
      { "id": "tum-hi-ho", "title": "Tum Hi Ho", "emoji": "💖", "desc": "Bollywood pick" }

   - id     the file name without ".mp3". Lowercase letters, digits and dashes only (max 40 chars).
   - title  what the sender sees in the picker (any spelling / language you like).
   - emoji  optional (defaults to a music note).
   - desc   optional small text under the title.
   - Keep the commas between lines right, and no comma after the last one.

3. Deploy / refresh. The song appears in the picker in the order listed in songs.json.

A song listed in songs.json shows as "Coming soon" (and can't be picked) until its mp3 exists,
so you can add titles first and upload audio later. Up to 60 songs are shown.

IMPORTANT
- You must have the legal right to use each song on a public, paid website
  (e.g. a licence from the music label / publisher). Royalty-free tracks are fine.
- Keep each file around 5 MB or less (128 kbps mp3) so surprises open fast on mobile.
- If a song file ever fails to load for a recipient, the surprise plays the built-in
  "dreamy" instrumental instead of going silent.
