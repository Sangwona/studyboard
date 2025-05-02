from flask import Blueprint, jsonify, request
from database import db
from models import Group
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

group_bp = Blueprint("group", __name__)

@group_bp.route("/board/groups", methods=["GET"])
def get_groups():
    groups = Group.query.order_by(Group.created_at.desc()).all() 
    print (groups)

    public_groups = Group.query.filter(Group.is_public == True).order_by(Group.created_at.desc()).all()
    print (public_groups)

    return jsonify({
        "groups": [{
            "id": group.id,
            "group_name": group.group_name,
            "max_member": group.max_members,
            "is_public": group.is_public,
            "date": group.created_at.strftime("%Y-%m-%d %H:%M:%S") if group.created_at else None,
            "description": group.description
        }
        # change this to "for group in groups" to get the entire (public + private groups)
        for group in public_groups
        ]
    })
