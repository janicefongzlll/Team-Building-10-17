"""Bundle the locally vendored Three.js ESM files without network dependencies.
The vendor files use named imports and exports only. Keep their license headers.
"""
from pathlib import Path
import re, base64
root=Path(__file__).parent
out=root/'dist'
def object_entries(items):
 result=[]
 for item in items.split(','):
  pair=re.split(r'\s+as\s+',item.strip())
  result.append((pair[-1]+':'+pair[0]) if len(pair)==2 else pair[0])
 return ','.join(result)
core=(out/'vendor/three.core.min.js').read_text()
match=re.search(r'export\{([^}]+)\};\s*$',core)
assert match, 'Unexpected Three.js core export format'
core=core[:match.start()]+'return {'+object_entries(match[1])+'};'
module=(out/'vendor/three.module.min.js').read_text()
imp=re.search(r'import\{([^}]+)\}from["\'][^"\']+["\'];',module)
assert imp
entries=[]
for item in imp[1].split(','):
 pair=re.split(r'\s+as\s+',item.strip());entries.append(pair[0]+':'+pair[-1])
module=module[:imp.start()]+'const {'+','.join(entries)+'}=CORE;'+module[imp.end():]
reexport=re.search(r'export\{([^}]+)\}from["\'][^"\']+["\'];',module)
assert reexport
reitems=','.join(name.strip()+':CORE.'+name.strip() for name in reexport[1].split(','))
module=module[:reexport.start()]+module[reexport.end():]
last=re.search(r'export\{([^}]+)\};\s*$',module)
assert last
module=module[:last.start()]+'return {'+reitems+','+object_entries(last[1])+'};'
world=(out/'world.js').read_text().replace("import * as THREE from './vendor/three.module.min.js';",'').replace('export class RailwayWorld','class RailwayWorld').replace("import { experienceState, smooth, clamp01 } from './timeline.js';",'')
embedded={name:'data:image/png;base64,'+base64.b64encode((out/f'assets/{name}.png').read_bytes()).decode() for name in ['frog','monkey','wolf','horse','mentor-host','joanne-host','team-qualities']}
import json
world=world.replace("import { warmRecipeShaders } from './recipe-performance.js';",'')
world=world.replace("import { GAME_MODELS } from './game-assets.js';",'').replace("import { buildGameStreetLife } from './game-street-life.js';",'')
world=world.replace("import { buildGameCity } from './game-city.js';",'').replace("import { buildRestStation } from './rest-station.js';",'').replace("import { buildTeamRecipe } from './team-recipe.js';",'').replace("import { buildJoanneStation } from './joanne-station.js';",'')
world=world.replace("import { buildFinalStation } from './final-station.js';",'').replace("import { buildPremiumTrain } from './train-upgrade.js';",'').replace("import { upgradeJourneyEnvironment } from './journey-detail.js';",'')
world=(out/'recipe-performance.js').read_text().replace('export ','')+'\n'+(out/'game-street-life.js').read_text().replace('export ','')+'\n'+(out/'train-upgrade.js').read_text().replace('export ','')+'\n'+(out/'journey-detail.js').read_text().replace('export ','')+'\n'+(out/'final-station.js').read_text().replace('export ','')+'\n'+(out/'joanne-station.js').read_text().replace('export ','')+'\n'+(out/'bakery-finish.js').read_text().replace('export ','')+'\n'+(out/'recipe-gallery.js').read_text().replace('export ','')+'\n'+(out/'artisan-bakery.js').read_text().replace('export ','')+'\n'+(out/'team-recipe.js').read_text().replace('export ','').replace("import { buildArtisanBakery } from './artisan-bakery.js';",'').replace("import { buildRecipeGallery } from './recipe-gallery.js';",'').replace("import { finishBakery } from './bakery-finish.js';",'').replace("import { prepareRecipeRendering } from './recipe-performance.js';",'')+'\n'+(out/'rest-station.js').read_text().replace('export ','')+'\n'+(out/'game-assets.js').read_text().replace('export ','')+'\n'+(out/'game-city.js').read_text().replace('export ','')+'\n'+(out/'timeline.js').read_text().replace('export ','')+'\n'+world
world='const ANIMAL_TEXTURES='+json.dumps(embedded)+';\n'+world.replace('`assets/${name}.png`','ANIMAL_TEXTURES[name]')
app=(out/'app.js').read_text().replace("import { RailwayWorld } from './world.js';",'').replace("import { travelProgress } from './timeline.js';",'').replace("import { TEAM_QUALITIES } from './team-recipe.js';",'')
(out/'runtime.js').write_text('/* MJM LINE · Local offline build. Three.js MIT license preserved below. */\n(()=>{const CORE=(()=>{'+core+'})();const THREE=(()=>{'+module+'})();\n'+world+'\n'+app+'\n})();')
html=(out/'index.html').read_text()
css=(out/'style.css').read_text()
runtime=(out/'runtime.js').read_text().replace('</script','<\\/script')
html=re.sub(r'<link rel="stylesheet"[^>]+>',lambda _: '<style>'+css+'</style>',html)
html=re.sub(r'<script src="runtime.js[^\"]*"></script>',lambda _: '<script>'+runtime+'</script>',html)
(root/'MJM-Line-Scroll-Prototype.html').write_text(html)
print('Built dist/runtime.js and MJM-Line-Scroll-Prototype.html')
