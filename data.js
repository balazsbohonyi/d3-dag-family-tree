function buildData(maxLevels = 2) {
    const persons = {}
    const unions = {}
    const links = []

    let personCounter = 0
    let unionCounter = 0

    function updatePerson(id, ownUnions, parentUnion) {
        const person = persons[id]

        if (!person) {
            throw Error('person not found with id ' + id)
        }

        for (const ownUnion of ownUnions) {
            let currentUnion = unions[ownUnion]
            if (!currentUnion) {
                unions[ownUnion] = {
                    id: ownUnion,
                    partner: [id],
                    children: [],
                }
                currentUnion = unions[ownUnion]
            } else if (!(currentUnion.partner || []).includes(id)) {
                currentUnion.partner = [
                    ...(currentUnion.partner || []),
                    id,
                ]
            }
            if (!links.find(([left, right]) => left === currentUnion.id && right === id || right === id && left === currentUnion.id)) {
                links.push([id, currentUnion.id])
            }
        }

        if (parentUnion) {
            const currentUnion = unions[parentUnion]
            if (!currentUnion) {
                unions[parentUnion] = {
                    id: parentUnion,
                    partner: [],
                    children: [id],
                }
            } else {
                currentUnion.children = [
                    ...(currentUnion.children || []),
                    id,
                ]
            }
            if (!links.find(([left, right]) => left === currentUnion.id && right === id || right === id && left === currentUnion.id)) {
                links.push([currentUnion.id, id])
            }
        }

        persons[id] = {
            ...person,
            own_unions: ownUnions,
            parent_union: parentUnion,
        }
        return person
    }

    function createPerson({ gender = 'male', ownUnions = [], parentUnion = null }) {
        const i = ++personCounter
        const id = 'id' + i
        const person = {
            id,
            gender,
            name: 'Person ' + i,
            birthyear: i,
            own_unions: ownUnions,
            parent_union: parentUnion,
        }

        for (const ownUnion of ownUnions) {
            let currentUnion = unions[ownUnion]
            if (!currentUnion) {
                unions[ownUnion] = {
                    id: ownUnion,
                    partner: [id],
                    children: [],
                }
                currentUnion = unions[ownUnion]
            } else if (!(currentUnion.partner || []).includes(id)) {
                currentUnion.partner = [
                    ...(currentUnion.partner || []),
                    id,
                ]
            }
            if (!links.find(([left, right]) => left === currentUnion.id && right === id || right === id && left === currentUnion.id)) {
                links.push([id, currentUnion.id])
            }
        }

        if (parentUnion) {
            const currentUnion = unions[parentUnion]
            if (!currentUnion) {
                unions[parentUnion] = {
                    id: parentUnion,
                    partner: [],
                    children: [id],
                }
            } else {
                currentUnion.children = [
                    ...(currentUnion.children || []),
                    id,
                ]
            }
            if (!links.find(([left, right]) => left === currentUnion.id && right === id || right === id && left === currentUnion.id)) {
                links.push([currentUnion.id, id])
            }
        }

        persons[id] = person
        return person
    }


    function buildUnionId() {
        return 'u' + (++unionCounter)
    }

    function createFamily(partner1, partner2, level = 0) {


        const uid = buildUnionId()

        updatePerson(partner1.id, [uid])
        updatePerson(partner2.id, [uid])

        if (level >= maxLevels) {
            return
        }

        for (let i = 0; i < 2; i++) {
            const child = createPerson({ gender: 'female', ownUnions: [], parentUnion: uid })
            const childPartner = createPerson({ gender: 'male' })
            createFamily(child, childPartner, level + 1)
        }
    }

    const partner1 = createPerson({ gender: 'male' })
    const partner2 = createPerson({ gender: 'female' })

    createFamily(partner1, partner2)

    return {
        start: Object.keys(persons)[0],
        persons,
        unions,
        links
    }
}

data = buildData(3)

console.log(data)
alert(Object.keys(data.persons).length)
