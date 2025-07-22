import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifyAdmin } from "../../src/middlewares/verifyAdmin.js";
import { getMockRes } from "../testUtils.js";

describe('verifyAdmin', () => {
    let req, res, next

    beforeEach(() => {
        res = getMockRes(),
            next = vi.fn()
    })

    // Checking rejection when user is absent
    it('should return status 401 and an error message if user is absent', () => {
        req = {};
        verifyAdmin(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Utilisateur non authentifié'
        })
        expect(next).not.toHaveBeenCalled()
    })
      
        // Checking rejection when user is absent
    it('should return status 401 and an error message if user is false', () => {
        req = {user : false};
        verifyAdmin(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Utilisateur non authentifié'
        })
        expect(next).not.toHaveBeenCalled()
    })

    // Checking rejection when admin is absent
    it('should return status 403 and an error message if user does is not admin', () => {
        req = { user: {} };
        verifyAdmin(req, res, next)
        
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Accès refusé : rôle admin requis'
        })
        expect(next).not.toHaveBeenCalled()
    })

    // Checking rejection when admin is false
     it('should return status 403 and an error message if user.admin is false', () => {
        req = { user: {admin : false} };
        verifyAdmin(req, res, next)
        
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Accès refusé : rôle admin requis'
        })
        expect(next).not.toHaveBeenCalled()
    })
      
        // Checking rejection when admin is other than true or false
     it('should return status 403 and an error message if user.admin is false', () => {
        req = { user: {admin : "yes"} };
        verifyAdmin(req, res, next)
        
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Accès refusé : rôle admin requis'
        })
        expect(next).not.toHaveBeenCalled()
    })

    // checking next when user is admin
    it('Should call next when user is present and admin', () => {
        req = { user: {admin :true} }

        verifyAdmin(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

})