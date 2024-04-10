import { Router } from 'express';
import { UsuariosManagerMongo } from '../dao/controllers/Mongo/userManagerMongo.js';
import { hash } from '../utils.js';
export const router = Router()


let usuariosManager = new UsuariosManagerMongo()

router.post('/register', async (req, res) => {

    let { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.redirect("/register?error=Faltan datos")
    }

    let existe = await usuariosManager.getBy({ email })
    if (existe) {
        return res.redirect(`/register?error=Ya existen usuarios con email ${email}`)
    }

    let rol = 'user';
    if (email === 'admincoder@coder.com') {
        rol = 'admin';
    }
    password = hash(password)
    
    try {
        await usuariosManager.create({ username, email, password, rol })
        res.setHeader('Content-Type', 'application/json');
        res.redirect("http://localhost:8080/")
    } catch (error) {
        return res.status(400).json({ error: `Error inseperado` })
    }
})

router.post('/login', async (req, res) => {

    let { email, password } = req.body
    if (!email || !password) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Faltan datos` })
    }

    let usuario = await usuariosManager.getBy({ email })
    if (!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Credenciales incorrectas` })
    }

    if (usuario.password !== hash(password)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Credenciales incorrectas` })
    }

    usuario = { ...usuario }
    delete usuario.password
    req.session.usuario = usuario

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({
        message: "Login correcto", usuario
    })
})


router.get('/logout', (req, res) => {
    req.session.destroy(e => {
        if (e) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${e.message}`
                }
            )
        }
    })
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        message: "Logout exitoso"
    });
});