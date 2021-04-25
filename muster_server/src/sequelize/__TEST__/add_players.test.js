import {sequelize} from "../"

test("Add player rows", async () => {
    await sequelize.sync();
    const playerModel = sequelize.models.Player;
    await playerModel.create({name: "Alice"});
    await playerModel.create({name: "Bob"});
    const contents = await playerModel.findAll({attributes: ['name']})

    expect(contents).toBeTruthy();
    console.log(process.env.NODE_ENV);
    console.log(JSON.stringify(contents));
});