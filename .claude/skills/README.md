# Skills in dit project

## impeccable

Ontwerp-skill van Paul Bakaus, Apache-2.0
(https://github.com/pbakaus/impeccable), hier meegeleverd zodat hij
beschikbaar is zonder installatie.

Waarom meegeleverd en niet geïnstalleerd: `npx impeccable install` haalt een
ondertekende bundel op via een redirect die vanuit deze omgeving een 403 geeft.
De repo klonen en `plugin/skills/impeccable` kopiëren werkt wel.

Bijwerken:

    git clone --depth 1 https://github.com/pbakaus/impeccable /tmp/imp
    rm -rf .claude/skills/impeccable
    cp -r /tmp/imp/plugin/skills/impeccable .claude/skills/
    cp /tmp/imp/LICENSE /tmp/imp/NOTICE.md .claude/skills/impeccable/

Gebruik: `/impeccable critique`, `/impeccable polish`, `/impeccable layout`,
`/impeccable typeset`. Zonder argument toont hij een menu.
