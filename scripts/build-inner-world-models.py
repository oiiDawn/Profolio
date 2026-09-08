"""Build and round-trip-check an original tabletop compass island with Blender 5.2.

Run from the repository root: Blender --background --python scripts/build-inner-world-models.py.
GLTF is Y-up. Avatar feet are at Y=0, facing +Z. Station origins in Three:
fitness=(-7,0,0), gaming=(0,0,-7), food=(0,0,7), travel=(7,0,0).
Walk centerline in Three XZ: P0=(0,0), P2=5.3*direction,
P1=0.5*P2 + 0.9*(-direction.z,direction.x); quadratic Bezier then stops at P2.
The modeled path continues from P2 toward the prop at radius 7.
world.glb contains the independent mesh node WalkableSurface, material Collider.
Raycast this mesh for elevation; runtime sets visible/castShadow/receiveShadow false.
Station GLBs already contain their terrace elevation, so station origin Y stays zero.
Desktop overview in Three: position=(18,18,24), target=(0,-1,0), visibleWidth=28.
Physical signs face Three yaw +36.87 degrees and lean back 9.17 degrees.
"""

import json
import random
import struct
from array import array
from math import atan2, cos, exp, pi, sin
from pathlib import Path

import bpy
from mathutils import Matrix, Vector
from mathutils.geometry import delaunay_2d_cdt


ROOT = Path.cwd()
SOURCE = ROOT / "assets/inner-world/inner-world.blend"
EXPORTS = ROOT / "public/portfolio/inner-world"
PREVIEWS = ROOT / "assets/inner-world/previews"
UI_EXPORTS = EXPORTS / "ui"
AVATAR_SCALE = 1.6
SIGN_NAMES = ("fitness", "gaming", "food", "travel", "exit")
STATIONS = {"fitness": (-7, 0), "gaming": (0, 7), "food": (0, -7), "travel": (7, 0)}
TERRACE_HEIGHTS = {"fitness": 1.45, "gaming": 1.12, "food": 0.95, "travel": 1.22}
STOP_RADIUS = 5.3
PATH_BEND = 0.9
OVERVIEW_CAMERA = (18, -24, 18)
OVERVIEW_TARGET = (0, 0, -1)
OVERVIEW_WIDTH = 28.0
PHYSICAL_SIGNS = {"fitness": (.3,-2.65), "gaming": (1.9,-2.25), "food": (-.2,-2.4), "travel": (1.0,-2.4)}
SIGN_YAW = atan2(18,24)
RNG = random.Random(50719)
PALETTE = {}


def material(name, color, roughness=0.86, metallic=0, glow=0):
    value = bpy.data.materials.new(name)
    value.diffuse_color = (*color, 1)
    value.use_nodes = True
    shader = value.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    if glow:
        shader.inputs["Emission Color"].default_value = (*color, 1)
        shader.inputs["Emission Strength"].default_value = glow
    PALETTE[name] = value


def collection(name):
    value = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(value)
    return value


def finish(obj, name, target, color):
    obj.name = name
    obj.data.name = obj.name
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    target.objects.link(obj)
    obj.data.materials.append(PALETTE[color])
    return obj


def mesh(name, target, color, vertices, faces):
    data = bpy.data.meshes.new(name)
    data.from_pydata(vertices, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    target.objects.link(obj)
    data.materials.append(PALETTE[color])
    return obj


def box(name, target, color, at, size, rotation=(0, 0, 0), bevel=0):
    bpy.ops.mesh.primitive_cube_add(location=at, rotation=rotation)
    obj = bpy.context.object
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    finish(obj, name, target, color)
    if bevel:
        modifier = obj.modifiers.new("Single-cut corners", "BEVEL")
        modifier.width, modifier.segments = bevel, 1
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def cylinder(name, target, color, at, radius, depth, vertices=8, rotation=(0, 0, 0), top=None):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius, radius2=radius if top is None else top,
                                  depth=depth, location=at, rotation=rotation)
    return finish(bpy.context.object, name, target, color)


def ico(name, target, color, at, scale, subdivisions=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=at)
    obj = bpy.context.object
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, target, color)


def beam(name, target, color, a, b, width):
    delta = Vector(b) - Vector(a)
    obj = cylinder(name, target, color, (Vector(a) + Vector(b)) * 0.5, width, delta.length, vertices=6)
    obj.rotation_euler = delta.to_track_quat("Z", "Y").to_euler()
    return obj


def facets(obj, colors):
    for name in colors:
        obj.data.materials.append(PALETTE[name])
    for face in obj.data.polygons:
        face.material_index = RNG.randrange(len(obj.data.materials))
    return obj


def loft(name, target, color, rings, segments=14, arc=2*pi):
    """Sculpt a tapered faceted volume from elliptical cross-sections."""
    closed = abs(arc-2*pi) < .001
    count = segments if closed else segments+1
    vertices = []
    for level, (x,y,z,rx,ry) in enumerate(rings):
        for n in range(count):
            angle = -pi/2 + (2*pi-arc)/2 + n*arc/segments
            vertices.append((x+rx*cos(angle), y+ry*sin(angle), z))
    faces = []
    for level in range(len(rings)-1):
        for n in range(segments):
            nxt = (n+1)%count
            a,b,c,d = level*count+n, level*count+nxt, (level+1)*count+nxt, (level+1)*count+n
            faces.extend(((a,b,c),(a,c,d)))
    if closed:
        faces.extend((tuple(reversed(range(count))),tuple(range((len(rings)-1)*count,len(rings)*count))))
    return mesh(name,target,color,vertices,faces)


def torus(name,target,color,at,major,minor,rotation=(0,0,0),segments=20):
    bpy.ops.mesh.primitive_torus_add(major_segments=segments,minor_segments=8,major_radius=major,
                                   minor_radius=minor,location=at,rotation=rotation)
    return finish(bpy.context.object,name,target,color)


def terrain_height(x,y):
    """Terraces rise around a lower camp; relief fades out along the four trails."""
    radial = (x*x+y*y)**.5
    if radial < 1.85:
        return -.075
    t = min(1,max(0,(radial-1.85)/3.75))
    rise = t*t*(3-2*t)
    weights = {name:max(0,(x*sx+y*sy)/(7*radial))**8 for name,(sx,sy) in STATIONS.items()}
    height = sum(weights[name]*TERRACE_HEIGHTS[name] for name in STATIONS)/sum(weights.values())
    off_axis = min(abs(x),abs(y))
    relief = (.24*sin(x*.81)*cos(y*.72)+.12*sin(x*1.7+y*.9))*min(1,off_axis/1.3)
    channel = -.24*exp(-((x+4.2)**2+(y+3.8)**2)/2.5)
    return -.075 + rise*height + relief + channel*rise


def terrace(target,name):
    """Irregular local bedrock, stone steps, and edge blocks replace circular tokens."""
    family = {"fitness":"red","gaming":"violet","food":"rock","travel":"teal"}[name]
    color = {"fitness":"Red sand","gaming":"Violet stone","food":"Wheat earth","travel":"Teal ground"}[name]
    angles = [2*pi*n/24 for n in range(24)]
    vertices = []
    for z,radius in ((-.72,2.37),(-.22,2.62),(.025,2.39)):
        vertices.extend((radius*(1+.075*sin(3*a)+.03*cos(7*a))*cos(a),
                         radius*(1+.06*sin(5*a))*sin(a),z+.025*sin(4*a)) for a in angles)
    vertices.append((0,0,.025))
    faces = []
    for ring in range(2):
        for n in range(24):
            a,b=ring*24+n,ring*24+(n+1)%24
            faces.extend(((a,b,b+24),(a,b+24,a+24)))
    faces.extend((72,48+n,48+(n+1)%24) for n in range(24))
    facets(mesh(f"{name.title()} layered irregular terrace",target,color,vertices,faces),
           {"fitness":("Red rock","Red sun"),"gaming":("Lavender stone","Indigo stone"),
            "food":("Grass olive","Wheat earth"),"travel":("Teal stone","Teal sun")}[name])
    inward = -Vector(STATIONS[name]).normalized()
    for n in range(15):
        a = 2*pi*n/15
        point = Vector((cos(a),sin(a)))
        if point.dot(inward) > .75:
            continue
        rock(target,(2.27*point.x,2.27*point.y,-.13),(.34,.38,.36),family)
    across = Vector((-inward.y,inward.x))
    for n in range(4):
        p = inward*(2.65-n*.25)
        box("Broad terrace entry stair",target,"Path" if name!="gaming" else "Lavender stone",
            (p.x,p.y,-.3+n*.09),(1.18,.33,.18),rotation=(0,0,atan2(across.y,across.x)),bevel=.045)


def tree(target, at, height, family="pine"):
    x, y, z = at
    shades = {"pine": ("Pine deep", "Pine", "Pine sun"), "violet": ("Indigo", "Violet", "Lavender"),
              "oak": ("Leaf dark", "Grass", "Grass sun")}[family]
    loft("Tapered branching tree trunk",target,"Bark",[(x,y,z,.10*height,.09*height),
         (x+.025*height,y,z+.38*height,.07*height,.06*height),
         (x-.03*height,y+.02*height,z+.78*height,.025*height,.025*height)],segments=9)
    if family == "oak":
        for dx,dy,dz,scale in ((-.16,.02,.74,.31),(.19,.03,.83,.32),(0,-.15,.96,.33)):
            beam("Exposed broadleaf branch",target,"Bark",(x,y,z+.45*height),(x+dx*height,y+dy*height,z+dz*height),.04*height)
            facets(ico("Layered faceted broadleaf canopy",target,shades[0],(x+dx*height,y+dy*height,z+dz*height),
                       (height*scale,height*scale*.88,height*scale*.83),subdivisions=2),shades[1:])
    else:
        for tier,(level,width) in enumerate(((.27,.32),(.42,.30),(.57,.25),(.72,.2),(.85,.14))):
            vertices=[]
            for ring,ratio in enumerate((1,.67,.11)):
                for n in range(12):
                    angle=2*pi*n/12+tier*.19
                    radius=height*width*ratio*(1 if n%2==0 else .78)
                    vertices.append((x+radius*cos(angle),y+radius*sin(angle),
                                     z+height*(level+ring*.12)+(.04*height if n%2 else 0)))
            vertices.append((x+.018*height,y-.025*height,z+height*(level+.31)))
            faces=[]
            for ring in range(2):
                for n in range(12):
                    a,b=ring*12+n,ring*12+(n+1)%12
                    faces.extend(((a,b,b+12),(a,b+12,a+12)))
            faces.extend((24+n,24+(n+1)%12,36) for n in range(12))
            faces.append(tuple(reversed(range(12))))
            facets(mesh(f"{family.title()} overlapping bough tier {tier}",target,shades[0],vertices,faces),shades[1:])


def rock(target, at, size, family="rock"):
    shades = {"rock": ("Rock", "Rock shade", "Rock sun"), "red": ("Red rock", "Red sun", "Red shade"),
              "teal": ("Teal stone", "Teal sun", "Pine"), "violet": ("Violet stone", "Lavender stone", "Indigo stone")}[family]
    if family=="red" and max(size)>1:
        x,y,z=at
        sx,sy,sz=size
        obj=loft("Layered red sandstone butte",target,shades[0],
                 [(x,y,z-sz*.86,sx*.81,sy*.84),(x-.08*sx,y,z-sz*.38,sx,sy),
                  (x+.07*sx,y,z+sz*.15,sx*.86,sy*.9),(x+.03*sx,y+.06*sy,z+sz*.65,sx*.64,sy*.71),
                  (x-.08*sx,y+.08*sy,z+sz*.86,sx*.46,sy*.54)],segments=9)
    else:
        obj=ico(f"Fractured {family} boulder",target,shades[0],at,size,subdivisions=3 if max(size)>1 else 2)
    for v in obj.data.vertices:
        v.co *= 1+.08*sin(v.co.x*8+v.co.y*6+v.co.z*9)
    facets(obj,shades[1:])
    for face in obj.data.polygons:
        light=face.normal.dot(Vector((-.6,-.4,.7)))
        face.material_index=1 if light>.3 else 2 if light<-.3 else 0
    return obj


def fence(target, points):
    for x, y in points:
        box("Fence square post", target, "Wood", (x, y, 0.58), (0.14, 0.14, 1.12), bevel=0.02)
        cylinder("Fence post cap", target, "Wood sun", (x, y, 1.15), 0.12, 0.1, vertices=4)
    for a, b in zip(points, points[1:]):
        for z in (0.45, 0.87):
            beam("Fence rail", target, "Wood sun", (*a, z), (*b, z), 0.07)


def meadow_cluster(target, at, size=1, flowers=None):
    """Model a coherent tuft with folded leaves and optional five-petal flowers."""
    x,y,z=at
    vertices=[]
    faces=[]
    for n in range(13):
        a=n*2.39996
        radius=size*(.08+.035*(n%4))
        px,py=x+radius*cos(a),y+radius*sin(a)
        h=size*(.22+.11*(n%3))
        start=len(vertices)
        vertices.extend(((px-.045*size*sin(a),py+.045*size*cos(a),z),
                         (px+.045*size*sin(a),py-.045*size*cos(a),z),
                         (px+.12*size*cos(a),py+.12*size*sin(a),z+h*.7),
                         (px+.21*size*cos(a),py+.21*size*sin(a),z+h)))
        faces.extend(((start,start+1,start+2),(start,start+2,start+3)))
    facets(mesh("Folded meadow grass blades",target,"Grass shade",vertices,faces),("Grass sun","Leaf dark"))
    if flowers:
        vertices=[]
        faces=[]
        for n in range(4):
            a=n*2.39996+.2
            px,py=x+size*.23*cos(a),y+size*.23*sin(a)
            h=size*(.29+.095*(n%3))
            beam("Fine wildflower stem",target,"Leaf dark",(px,py,z),(px,py,z+h),.014*size)
            for petal in range(5):
                angle=petal*2*pi/5+.1*n
                axis=Vector((cos(angle),sin(angle)))
                side=Vector((-axis.y,axis.x))
                center=Vector((px,py))+axis*.10*size
                start=len(vertices)
                vertices.extend(((px,py,z+h),(center.x+side.x*.059*size,center.y+side.y*.059*size,z+h+.025*size),
                                 (px+axis.x*.19*size,py+axis.y*.19*size,z+h+.01*size),
                                 (center.x-side.x*.059*size,center.y-side.y*.059*size,z+h+.025*size)))
                faces.extend(((start,start+1,start+2),(start,start+2,start+3)))
            ico("Wildflower golden center",target,"Ochre",(px,py,z+h+.018*size),(.046*size,.046*size,.03*size))
        mesh("Five petal meadow blossoms",target,flowers,vertices,faces)


def shrub(target, at, size=1, family="green"):
    colors={"green":("Leaf dark","Grass shade","Grass"),"teal":("Pine deep","Pine","Pine sun"),
            "violet":("Indigo","Violet","Lavender")}[family]
    x,y,z=at
    for dx,dy,h,s in ((-.24,0,.3,.36),(.2,.1,.38,.38),(0,-.16,.22,.31)):
        obj=ico("Clustered wild shrub",target,colors[0],(x+dx*size,y+dy*size,z+h*size),
                (s*size,s*.84*size,s*.9*size),subdivisions=2)
        facets(obj,colors[1:])


def cactus(target, at, height):
    x,y,z=at
    loft("Ribbed desert cactus trunk",target,"Cactus",[(x,y,z,.13,.14),(x,y,z+height*.85,.13,.14),
         (x,y,z+height,.055,.06)],segments=10)
    for side,factor in ((-1,.52),(1,.72)):
        beam("Cactus bent arm",target,"Cactus sun",(x,y,z+height*factor),(x+side*.28,y,z+height*factor),.08)
        loft("Cactus upright arm",target,"Cactus",[(x+side*.28,y,z+height*factor,.09,.085),
             (x+side*.28,y,z+height*(factor+.27),.075,.07),(x+side*.28,y,z+height*(factor+.31),.025,.025)],segments=8)
    for n in range(5):
        a=n*2*pi/5
        beam("Cactus highlighted rib",target,"Cactus sun",(x+.132*cos(a),y+.142*sin(a),z+.10),
             (x+.132*cos(a),y+.142*sin(a),z+height*.86),.009)


def banner(target, at, color, emblem):
    x,y,z=at
    for dx in (-.58,.58):
        cylinder("Banner timber upright",target,"Wood",(x+dx,y,z+1.45),.065,2.9,vertices=9)
    beam("Banner hanging crossbar",target,"Wood sun",(x-.70,y,z+2.87),(x+.7,y,z+2.87),.065)
    vertices=[(x-.47,y-.05,z+2.70),(x+.47,y-.05,z+2.70),(x+.47,y-.12,z+1.42),
              (x+.12,y-.15,z+1.23),(x-.47,y-.09,z+1.4)]
    flag=mesh("Heavy folded adventure banner",target,color,vertices,[(0,1,2),(0,2,4),(2,3,4)])
    solid=flag.modifiers.new("Woven banner thickness","SOLIDIFY")
    solid.thickness=.025
    bpy.context.view_layer.objects.active=flag
    bpy.ops.object.modifier_apply(modifier=solid.name)
    if emblem=="fitness":
        beam("Banner painted dumbbell shaft",target,"Linen",(x-.24,y-.17,z+2.06),(x+.24,y-.17,z+2.06),.033)
        for dx in (-.28,-.18,.18,.28):
            box("Banner painted dumbbell plate",target,"Linen",(x+dx,y-.174,z+2.06),(.065,.02,.3 if abs(dx)<.2 else .4),bevel=.01)
    else:
        torus("Banner compass painted circle",target,"Linen",(x,y-.18,z+2.06),.25,.022,rotation=(pi/2,0,0),segments=24)
        for n in range(8):
            a=n*pi/4
            r=.38 if n%2==0 else .23
            mesh("Banner compass rose point",target,"Linen",
                 [(x,y-.185,z+2.06),(x+.06*cos(a+pi/2),y-.185,z+2.06+.06*sin(a+pi/2)),
                  (x+r*cos(a),y-.185,z+2.06+r*sin(a))],[(0,1,2)])


def waters_and_clouds(target):
    """Saturated sea, a modeled stream/cascade, and actual faceted cloud volumes."""
    vertices=[]
    faces=[]
    for row in range(49):
        for col in range(49):
            x,y=(col-24)*1.2,(row-24)*1.2
            vertices.append((x,y,-4.88+.014*sin(x*.7+y*.4)))
    for row in range(48):
        for col in range(48):
            a=row*49+col
            faces.extend(((a,a+1,a+50),(a,a+50,a+49)))
    sea=mesh("Faceted sapphire surrounding sea",target,"Water",vertices,faces)
    for color in ("Water deep","Water teal","Water sun"):
        sea.data.materials.append(PALETTE[color])
    for face in sea.data.polygons:
        p=face.center
        face.material_index=(face.index//2*17//7)%4 if (face.index//2)%7==0 else 0
    stream=[Vector((3.95,-5.1)),Vector((4.46,-5.60)),Vector((4.98,-6.24)),Vector((5.73,-7.15))]
    for n,(a,b) in enumerate(zip(stream,stream[1:])):
        direction=(b-a).normalized()
        side=Vector((-direction.y,direction.x))*.48
        corners=(a-side,b-side,b+side,a+side)
        mesh("Cobalt creek flowing to cliff notch",target,"Water teal",
             [(p.x,p.y,terrain_height(p.x,p.y)+.048) for p in corners],[(0,1,2),(0,2,3)])
        for sign in (-1,1):
            p=(a+b)*.5+side*sign*1.35
            rock(target,(p.x,p.y,terrain_height(p.x,p.y)+.08),(.30+.07*(n%3),.35+.07*((n+sign)%3),.26+.065*(n%2)))
    end=stream[-1]
    outward=Vector((.62,-.78))
    across=Vector((.78,.62))
    top=terrain_height(end.x,end.y)+.07
    for strand in range(9):
        offset=(strand-4)*.13
        base=end+across*offset
        vertices=[]
        for n in range(7):
            t=n/6
            p=base+outward*(.15+.42*t*t)+across*(.02*sin(n+strand))
            z=top*(1-t)-4.77*t
            width=.092 if strand%3 else .075
            vertices.extend(((p.x-across.x*width,p.y-across.y*width,z),
                             (p.x+across.x*width,p.y+across.y*width,z+.018*sin(strand))))
        faces=[(n*2,n*2+1,n*2+3,n*2+2) for n in range(6)]
        mesh("Faceted falling water ribbon",target,("Water","Water sun","Foam")[strand%3],vertices,faces)
    splash=end+outward*.7
    for n in range(18):
        a=n*2.39996
        r=.28+(n%4)*.20
        ico("Cascade white splash foam",target,"Foam",(splash.x+r*cos(a),splash.y+r*sin(a),-4.74+(n%3)*.06),
            (.22,.16,.10+(n%4)*.04),subdivisions=1)
    for radius in (.9,1.5,2.1):
        vertices=[]
        for n in range(37):
            a=n*2*pi/36
            for r in (radius,radius+.055):
                vertices.append((splash.x+r*cos(a),splash.y+r*sin(a),-4.79))
        mesh("Waterfall spreading foam ripple",target,"Water sun",vertices,[(2*n,2*n+1,2*n+3,2*n+2) for n in range(36)])
    for x,y,z,size in ((-9,.5,5.15,1.2),(-4,6.6,4.0,.9),(4,8,3.4,.85),(8,4.5,4.9,1.0),(-9,-3,3.5,.68)):
        for dx,dy,dz,s in ((-.7,0,-.07,.72),(0,0,.25,1),(.72,.02,.03,.7),(.2,-.15,-.18,.91)):
            cloud=ico("Faceted white drifting cloud",target,"Cloud",(x+dx*size,y+dy*size,z+dz*size),
                      (s*size,.48*s*size,.46*s*size),subdivisions=1)
            cloud.data.materials.append(PALETTE["Cloud shade"])
            for face in cloud.data.polygons:
                face.material_index=int(face.normal.z<-.25)


def island_ecology(target):
    """Plant authored meadow/forest groups in the spaces between the four paths."""
    groups=[(-4.8,3.3,1.1),(-3.1,4.0,.8),(3.1,3.4,1.1),(4.6,4.2,.85),
            (-4.8,-3.2,1),(-3.1,-4.0,.8),(3.9,-2.7,.9),(2.1,-3.2,.72),
            (-6.9,-3.2,.9),(-2.6,-7.9,.85),(7.8,-2.1,.85),(2.9,7.7,.95)]
    for i,(x,y,s) in enumerate(groups):
        z=terrain_height(x,y)
        shrub(target,(x,y,z),s,"teal" if x>3 else "green")
        for n in range(5):
            a=n*2.39996+i*.43
            px,py=x+(.6+.20*(n%3))*cos(a),y+(.6+.20*(n%3))*sin(a)
            meadow_cluster(target,(px,py,terrain_height(px,py)),.62+.15*(n%3),
                           ("Flower white","Flower gold","Flower purple")[i%3] if n%2==0 else None)
        rock(target,(x+.65,y+.43,terrain_height(x+.65,y+.43)+.1),(.36,.43,.34))
    for x,y,h,family in ((-5.2,5.1,2.3,"pine"),(4.0,5.35,2.7,"pine"),
                         (5.3,3.7,1.9,"pine"),(-6.5,-4.2,1.8,"oak"),(1.9,-6.7,1.9,"pine"),
                         (4.8,-2.4,2.2,"pine"),(-3.5,5.6,1.4,"oak")):
        tree(target,(x,y,terrain_height(x,y)),h,family)


def island(target):
    """Sculpt connected raised biomes above three broken, overhanging cliff shelves."""
    outline=[(10.3,.6),(10.15,2.2),(8.9,3.0),(8.25,3.1),(8.8,4.05),(7.3,4.4),
             (6.25,3.9),(5.6,5.0),(4.7,6.5),(3.4,7.35),(3.1,8.65),(1.9,10.2),
             (.3,10.6),(-1.6,10.2),(-2.9,8.7),(-3.25,7.7),(-4.7,7.5),(-5.25,6.5),
             (-4.8,5.2),(-6.4,4.4),(-7.8,4.55),(-8.75,3.1),(-10.1,2.5),(-10.65,.7),
             (-10.2,-1.9),(-9.1,-3.0),(-7.65,-3.0),(-7.05,-4.6),(-5.5,-4.7),(-4.5,-5.4),
             (-3.4,-7.4),(-3.55,-8.5),(-2.2,-9.8),(-.3,-10.05),(1.55,-9.6),(2.85,-8.9),
             (3.2,-7.45),(4.5,-6.5),(5.5,-6.85),(6.1,-5.8),(5.85,-4.4),(7.7,-3.5),
             (8.65,-3.85),(9.4,-2.4),(9.25,-1.35)]
    outline=[(x*(1+.38*max(0,9-(x*x+y*y)**.5)/(x*x+y*y)**.5),
              y*(1+.38*max(0,9-(x*x+y*y)**.5)/(x*x+y*y)**.5)) for x,y in outline]
    edge=[]
    for a,b in zip(outline,outline[1:]+outline[:1]):
        for t in (0,.5):
            x,y=a[0]*(1-t)+b[0]*t,a[1]*(1-t)+b[1]*t
            edge.append((x,y,terrain_height(x,y)))
    count=len(edge)
    points = [Vector((x, y)) for x, y, _ in edge]
    for row in range(-17, 18):
        for column in range(-17, 18):
            point = Vector((column * .61 + RNG.uniform(-0.2, 0.2), row * .61 + RNG.uniform(-0.2, 0.2)))
            crossings=sum(1 for a,b in zip(outline,outline[1:]+outline[:1])
                          if (a[1]>point.y)!=(b[1]>point.y) and point.x<(b[0]-a[0])*(point.y-a[1])/(b[1]-a[1])+a[0])
            if crossings%2:
                points.append(point)
    triangulated, _, faces, _, _, _ = delaunay_2d_cdt(points, [(n, (n + 1) % count) for n in range(count)],
                                                     [tuple(range(count))], 1, 0.0001)
    vertices = [(p.x, p.y, terrain_height(p.x,p.y)) for p in triangulated]
    facets(mesh("Sculpted continuous island terrain", target, "Grass", vertices, faces),
           ("Grass light", "Grass sun", "Grass shade", "Grass olive"))
    cliff_vertices = list(edge)
    layers=((-.48,1.025),(-1.35,.945),(-1.48,1.015),(-2.65,.985),(-3.75,.91),(-4.80,.87))
    for level,(depth,ratio) in enumerate(layers):
        cliff_vertices.extend((x*(ratio+.012*sin(n*.46+level)),y*(ratio+.014*cos(n*.37-level)),
                               depth+top*.65+.08*sin(n*.52+level*.3)) for n,(x,y,top) in enumerate(edge))
    cliff_faces = []
    for ring in range(len(layers)):
        for n in range(count):
            a, b = ring * count + n, ring * count + (n + 1) % count
            cliff_faces.extend(((a, a + count, b), (b, a + count, b + count)))
    cliff_faces.append(tuple(reversed(range(len(layers)*count,(len(layers)+1)*count))))
    cliff = facets(mesh("Jagged island cliff", target, "Rock", cliff_vertices, cliff_faces),
                   ("Rock shade", "Rock sun", "Rock mauve", "Rock warm", "Grass olive"))
    for face in cliff.data.polygons:
        ring=min(len(layers)-1,face.index//(count*2))
        face.material_index=(5,0,4,3,0,1)[ring] if face.index%7 else 2
    for n in (0,3,5,8,11,14,19,21,23,25,28,30,32,35,37,40,43):
        x,y=outline[n]
        h=terrain_height(x,y)
        width=.65+.13*(n%4)
        column=loft("Fractured cliff buttress with grassy crown",target,"Rock",
                    [(x*.91,y*.91,-4.75,width*.73,.65),(x,y,h-3.15,width,.77),
                     (x*1.014,y*1.014,h-1.2,width*.85,.63),(x*.985,y*.985,h-.25,width*.72,.54),
                     (x*.973,y*.973,h+.035,width*.61,.47)],segments=7)
        for color in ("Rock shade","Rock mauve","Rock warm","Grass shade"):
            column.data.materials.append(PALETTE[color])
        for face in column.data.polygons:
            face.material_index=4 if face.center.z>h-.26 else (1+(face.index//7)%3)
    for n,sx,sy in ((3,1.4,.65),(16,1.1,.85),(23,1.35,.7),(28,1.7,.95),(32,.95,.62),(36,1.25,.78),(42,1.5,.85)):
        x,y=outline[n]
        top=terrain_height(x,y)
        shelf=loft("Broad projecting bedrock shelf",target,"Rock warm",
                   [(x*.97,y*.97,top-2.2,sx*.67,sy*.7),(x,y,top-1.1,sx,sy),
                    (x*.99,y*.99,top-.85,sx*.95,sy*.98),(x*.95,y*.95,top-.73,sx*.78,sy*.8)],segments=9)
        facets(shelf,("Rock","Rock shade","Rock sun"))
    for x, y, height in ((-4.3, 4.2, 1.65), (4.1, 4.6, 1.4), (-4.4, -3.7, 1.25)):
        tree(target, (x, y, terrain_height(x,y)), height, "oak")
        for dx,dy in ((.65,.4),(-.6,-.37)):
            rock(target,(x+dx,y+dy,terrain_height(x+dx,y+dy)+.08),(.4,.38,.31))
    for n in range(52):
        angle=n*2.39996
        radius=3.1+(n%9)*.66
        x,y=radius*cos(angle),radius*sin(angle)
        if min(abs(x),abs(y))<.95:
            continue
        z=terrain_height(x,y)
        for leaf in range(4):
            a=angle+leaf*1.5
            length=.18+.1*(leaf%2)
            mesh("Sparse meadow blade cluster",target,"Grass sun" if leaf%2 else "Leaf dark",
                 [(x-.035*sin(a),y+.035*cos(a),z),(x+.035*sin(a),y-.035*cos(a),z),
                  (x+.07*cos(a),y+.07*sin(a),z+length)],[(0,1,2)])


def paths(target):
    """Sloping stone paths and a separate stable raycast surface share one centerline."""
    for name, (x, y) in STATIONS.items():
        direction = Vector((x, y)).normalized()
        endpoint = direction * STOP_RADIUS
        control = endpoint * 0.5 + Vector((direction.y, -direction.x)) * PATH_BEND
        points = [2 * (1 - t) * t * control + t * t * endpoint for t in [n / 22 for n in range(23)]]
        points.extend([direction * 5.8, direction * 6.35, direction * 6.8])
        for n, (a, b) in enumerate(zip(points, points[1:])):
            heading = (b - a).normalized()
            across = Vector((-heading.y, heading.x))
            half = 0.63 + RNG.uniform(-0.025, 0.025)
            corners = [a - across * half, b - across * half, b + across * half, a + across * half]
            tile = mesh(f"{name.title()} curved path tile {n:02d}", target, "Path",
                        [(v.x, v.y, terrain_height(v.x,v.y)+.055) for v in corners], ((0, 1, 2), (0, 2, 3)))
            facets(tile, ("Path sun", "Path peach"))
            if a.length>1.8 and n%2==0:
                mid=(a+b)*.5
                for side in (-1,1):
                    p=mid+across*(.28*side)
                    paving=box("Embedded split sandstone paving",target,"Path" if (n+side)%3 else "Path peach",
                               (p.x,p.y,terrain_height(p.x,p.y)+.032),(.5,(b-a).length*1.65,.11),
                               rotation=(0,0,atan2(heading.y,heading.x)-pi/2+RNG.uniform(-.07,.07)),bevel=.045)
            if n>=7 and n%2:
                for side in (-1, 1):
                    point = (a + b) * 0.5 + across * (0.71 * side)
                    rock(target,(point.x,point.y,terrain_height(point.x,point.y)+.04),(.19,.23,.16))
    terrain=target.objects["Sculpted continuous island terrain"]
    collider=bpy.data.objects.new("WalkableSurface",terrain.data.copy())
    target.objects.link(collider)
    collider.data.materials.clear()
    collider.data.materials.append(PALETTE["Collider"])
    for vertex in collider.data.vertices:
        vertex.co.z=.085 if vertex.co.xy.length<1.9 else vertex.co.z+.09
    for face in collider.data.polygons:
        face.material_index=0
    collider.hide_render=True
    collider["collision_only"]=True


def camp(target):
    cylinder("Camp raised circular foundation",target,"Rock shade",(0,0,-.10),1.93,.33,vertices=28)
    for ring in range(2):
        for n in range(16):
            a=n*2*pi/16+.05*ring
            outer=1.73 if ring else .91
            inner=.93 if ring else .02
            vertices=[(r*cos(t),r*sin(t),.08+RNG.uniform(-.002,.002)) for r,t in
                      ((inner,a+.018),(outer,a+.018),(outer,a+2*pi/16-.018),(inner,a+2*pi/16-.018))]
            facets(mesh("Camp fitted fan-shaped sandstone",target,"Camp stone",vertices,[(0,1,2),(0,2,3)]),("Rock warm",))
    for n in range(24):
        angle=2*pi*n/24
        box("Camp radial retaining block",target,"Rock sun",(1.85*cos(angle),1.85*sin(angle),.045),
            (.43,.27,.24),rotation=(0,0,angle+pi/2),bevel=.055)
    for x,y,angle in ((-1.04,.77,.5),(1.08,.74,-.6)):
        cylinder("Camp log seat",target,"Bark",(x,y,.25),.19,.83,vertices=14,rotation=(pi/2,0,angle))
        for end in (-1,1):
            cylinder("Log cut endgrain",target,"Wood sun",(x+sin(angle)*end*.425,y-cos(angle)*end*.425,.25),
                     .173,.018,vertices=14,rotation=(pi/2,0,angle))
    cx, cy = -1.08, -.79
    for n in range(8):
        angle = 2 * pi * n / 8
        ico("Fire ring stone", target, "Rock shade", (cx + 0.34 * cos(angle), cy + 0.34 * sin(angle), 0.13), (0.16, 0.12, 0.11))
    for angle in (-0.55, 0.55):
        cylinder("Camp firewood", target, "Bark", (cx, cy, 0.17), 0.07, 0.66, vertices=6, rotation=(pi / 2, 0, angle))
    for x, y, height in ((0, 0, 0.62), (0.16, 0.04, 0.39), (-0.13, 0.08, 0.44)):
        ico("Faceted amber flame", target, "Flame", (cx + x, cy + y, 0.23 + height * 0.35), (0.16, 0.13, height * 0.55))
    ico("Fire golden heart", target, "Flame light", (cx, cy - 0.04, 0.34), (0.1, 0.09, 0.26))
    for n in range(12):
        a=n*2*pi/12
        ico("Glowing charcoal bed",target,"Coal ember",(cx+.22*cos(a),cy+.20*sin(a),.115),(.09,.07,.055))
    for n in range(5):
        a=n*2.39996
        ico("Inner campfire leaping tongue",target,"Flame light",(cx+.1*cos(a),cy+.1*sin(a),.35+n*.035),(.07,.07,.26))
    for x,y,angle in ((-1.04,.77,.5),(1.08,.74,-.6)):
        for n in range(4):
            beam("Visible log bark seam",target,"Wood",(x-.3*cos(angle),y-.3*sin(angle),.32+n*.023),
                 (x+.3*cos(angle),y+.3*sin(angle),.32+n*.023),.012)


def fitness(target):
    terrace(target,"fitness")
    ground_objects=set(target.objects)
    for x,y,size in ((-1.25,1.0,(.8,.73,1.4)),(-.35,1.60,(.85,.63,2.15)),(.72,1.57,(.68,.62,1.68))):
        rock(target, (x, y, size[2] * 0.6), size, "red")
    box("Training bench charcoal cushion", target, "Charcoal", (0, -0.58, 0.64), (0.68, 1.55, 0.19), bevel=0.07)
    box("Training bench red seam", target, "Coral", (0, -0.59, 0.56), (0.7, 1.54, 0.05))
    box("Bench support rail", target, "Iron", (0, -0.56, 0.4), (0.17, 1.4, 0.15))
    for y in (-1.08, -0.06):
        box("Bench foot", target, "Iron", (0, y, 0.25), (0.91, 0.17, 0.4), bevel=0.025)
    for x in (-0.87, 0.87):
        box("Rack dark upright", target, "Iron", (x, 0.2, 1.09), (0.18, 0.2, 2.02), bevel=0.025)
        box("Rack broad foot", target, "Iron", (x, 0.1, 0.1), (0.43, 0.91, 0.16), bevel=0.025)
        box("Rack gold bar cradle", target, "Ochre", (x, -0.01, 1.65), (0.22, 0.34, 0.11))
    cylinder("Barbell silver shaft", target, "Silver", (0, -0.05, 1.76), 0.058, 2.91, vertices=24, rotation=(0, pi / 2, 0))
    for x, radius in ((-1.25, 0.42), (-1.02, 0.46), (1.02, 0.46), (1.25, 0.42)):
        cylinder("Cast red weight plate", target, "Coral", (x, -0.05, 1.76), radius, 0.17, vertices=20, rotation=(0, pi / 2, 0))
        torus("Weight plate raised circular rim",target,"Red sun",(x+(.095 if x>0 else -.095),-.05,1.76),radius*.81,.025,rotation=(0,pi/2,0))
    for x in (-1.39, 1.39):
        cylinder("Barbell collar", target, "Iron", (x, -0.05, 1.76), 0.13, 0.12, rotation=(0, pi / 2, 0))
    for x, y in ((-1.51, -0.7), (1.52, -0.59)):
        ico("Training kettlebell", target, "Iron", (x, y, 0.25), (0.2, 0.19, 0.24), subdivisions=2)
        torus("Cast kettlebell handle",target,"Iron",(x,y,.49),.1,.029,rotation=(pi/2,0,0),segments=16)
    fence(target, [(-2.0, 0.3), (-1.93, 1.2), (-1.25, 1.91)])
    torus("Training tire rubber body",target,"Charcoal",(-1.36,-1.5,.24),.37,.14,segments=28)
    for n in range(18):
        a=n*2*pi/18
        box("Tire raised tread",target,"Iron",(-1.36+.48*cos(a),-1.5+.48*sin(a),.24),(.16,.10,.2),rotation=(0,0,a),bevel=.025)
    for x in (-.87,.87):
        for z in (.42,.67,.92,1.17,1.42):
            cylinder("Rack adjustment pin",target,"Silver",(x,-.111,z),.035,.025,vertices=8,rotation=(pi/2,0,0))
    for obj in target.objects:
        if obj not in ground_objects:
            obj.location.x-=.34
    fence(target,[(-2.18,-.82),(-2.08,-1.8),(-1.03,-2.13)])
    torus("Spare training tire leaning on fence",target,"Charcoal",(-1.79,-.89,.55),.4,.15,
          rotation=(1.02,.18,-.24),segments=28)
    for n in range(3):
        box("Red sandstone training side stair",target,"Red sun",(.97,-1.68,.07+n*.16),
            (.75,.38,.23),rotation=(0,0,.16),bevel=.05).location.y+=n*.31
    for obj in target.objects:
        if obj.name.startswith(("Training kettlebell","Cast kettlebell handle")):
            obj.scale*=1.25


def gaming(target):
    terrace(target,"gaming")
    for row in range(4):
        for col in range(4):
            box("Ruin paving slab", target, ("Violet stone", "Lavender stone")[(row + col) % 2],
                (-1.05 + col * 0.68, -1.1 + row * 0.62, 0.045), (0.61, 0.55, 0.1), bevel=0.035)
    for x in (-1.30, 1.30):
        for level in range(5):
            box("Ancient arch pillar block", target, ("Indigo stone", "Violet stone")[level % 2],
                (x + RNG.uniform(-0.035, 0.035), .84, .24 + level*.45), (.68,.86,.43), bevel=.065)
    for n in range(9):
        a,b=n*pi/9+.01,(n+1)*pi/9-.01
        vertices=[(r*cos(t),y,2.20+r*sin(t)) for y in (.38,1.26) for r,t in ((1.03,a),(1.64,a),(1.64,b),(1.03,b))]
        stone=mesh("Thick interlocking arch voussoir",target,"Violet stone",vertices,
                   [(0,1,2,3),(7,6,5,4),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)])
        bevel=stone.modifiers.new("Worn masonry corners","BEVEL")
        bevel.width,bevel.segments=.045,1
        bpy.context.view_layer.objects.active=stone
        bpy.ops.object.modifier_apply(modifier=bevel.name)
    box("Arcade cabinet base", target, "Indigo", (0, -0.06, 0.55), (1.1, 0.83, 1.03), bevel=0.08)
    box("Arcade cabinet upper", target, "Violet", (0, 0.04, 1.49), (1.2, 0.75, 0.93), rotation=(0.09, 0, 0), bevel=0.08)
    box("Arcade screen dark surround", target, "Midnight", (0, -0.36, 1.51), (0.97, 0.05, 0.64), rotation=(0.09, 0, 0), bevel=0.03)
    box("Arcade screen glass", target, "Screen", (0, -0.394, 1.51), (0.8, 0.025, 0.48), rotation=(0.09, 0, 0))
    for row, bits in enumerate(("00100", "01110", "11111", "10101", "01010")):
        for col, bit in enumerate(bits):
            if bit == "1":
                box("Original pixel compass screen glyph", target, "Screen light", ((col - 2) * 0.075, -0.416, 1.68 - row * 0.075), (0.067, 0.016, 0.064))
    box("Arcade bright marquee", target, "Lavender", (0, -0.11, 2.01), (1.13, 0.6, 0.18), bevel=0.04)
    box("Arcade control deck", target, "Violet", (0, -0.57, 1.05), (1.23, 0.63, 0.19), rotation=(-0.12, 0, 0), bevel=0.04)
    cylinder("Arcade joystick", target, "Silver", (-0.27, -0.65, 1.23), 0.035, 0.25, vertices=6)
    ico("Arcade coral joystick ball", target, "Coral", (-0.27, -0.65, 1.36), (0.1, 0.1, 0.1), subdivisions=2)
    for x, color in ((0.15, "Ochre"), (0.37, "Coral")):
        cylinder("Arcade action button", target, color, (x, -0.66, 1.19), 0.075, 0.055)
    tree(target, (-1.95, 1.01, 0), 3.1, "violet")
    tree(target, (1.94, 1.38, 0), 3.75, "violet")
    tree(target, (1.9, -0.28, 0), 1.6, "pine")
    for x, y in ((-1.53, -0.48), (1.51, -0.99)):
        rock(target, (x, y, 0.2), (0.37, 0.3, 0.36), "violet")
    for x,y,h in ((-1.55,-.8,1.15),(-1.83,-.57,.74),(1.82,-.83,.89)):
        facets(loft("Amethyst ruin crystal",target,"Violet",[(x,y,.1,.13,.14),(x+.03,y,h*.75,.15,.13),(x+.07,y,h,.01,.01)],segments=6),("Lavender",))
    rock(target,(1.13,-1.25,.14),(.33,.37,.3),"violet")
    box("Relic sword broad blade",target,"Silver",(1.13,-1.25,.83),(.18,.075,1.06),rotation=(0,-.17,0),bevel=.022)
    box("Relic sword crossguard",target,"Ochre",(1.01,-1.25,1.33),(.53,.13,.09),bevel=.025)
    cylinder("Relic sword leather grip",target,"Pine deep",(.98,-1.25,1.5),.055,.30,vertices=10,rotation=(0,-.17,0))
    for n in range(3):
        box("Broken foreground ruin column",target,"Violet stone" if n%2 else "Indigo stone",
            (-1.58,-1.47,.2+n*.37),(.64,.58,.35),rotation=(0,.025*n,-.05+n*.03),bevel=.05)
    box("Fallen column capital",target,"Lavender stone",(-1.92,-1.14,.18),(.79,.63,.3),
        rotation=(.08,.19,.21),bevel=.06)
    for x,y,h in ((1.79,-1.41,.48),(2.02,-1.21,.7)):
        facets(loft("Foreground crystal cluster",target,"Violet",[(x,y,.02,.15,.16),
                    (x-.06,y,h*.72,.14,.13),(x-.09,y,h,.01,.01)],segments=6),("Lavender",))


def food(target):
    terrace(target,"food")
    for row in range(7):
        for col in range(7):
            box("Picnic blanket woven square", target, "Linen" if (row + col) % 2 else "Blanket red",
                (-1.27 + col * 0.42, -1.30 + row * 0.42, 0.045), (0.415, 0.415, 0.026))
    cylinder("Picnic round oak table", target, "Wood", (0, 0, 0.86), 1.14, 0.24, vertices=12)
    for x in (-0.33, 0.33):
        box("Picnic splayed table leg", target, "Bark", (x, 0, 0.43), (0.16, 0.76, 0.86), rotation=(0, x * 0.35, 0))
    for y in (-0.6, -0.2, 0.2, 0.6):
        box("Round tabletop plank", target, "Wood sun", (0, y, 0.991), (2 * (1.06 ** 2 - y ** 2) ** 0.5, 0.36, 0.03), bevel=0.02)
    for x, y in ((-1.34, -.12), (.44, -1.34), (1.48, .55)):
        cylinder("Picnic stool seat", target, "Wood sun", (x, y, 0.48), 0.33, 0.12)
        cylinder("Picnic stool base", target, "Bark", (x, y, 0.24), 0.17, 0.42, vertices=6)
    cylinder("Cream ceramic serving plate", target, "Linen", (0, -0.12, 1.06), 0.53, 0.065, vertices=16)
    torus("Ceramic serving plate raised lip",target,"Linen",(0,-.12,1.095),.49,.035,segments=24)
    ico("Roast on main plate", target, "Roast", (-0.13, -0.14, 1.17), (0.24, 0.16, 0.13), subdivisions=2)
    for x, y in ((0.15, -0.2), (0.22, -0.05), (0.08, 0.05)):
        box("Golden roast potato", target, "Potato", (x, y, 1.14), (0.15, 0.13, 0.14), rotation=(0.1, 0.2, x * 3), bevel=0.025)
    for x in (-0.24, -0.09, 0.04):
        ico("Salad leaf", target, "Leaf dark", (x, 0.14, 1.15), (0.11, 0.12, 0.07))
    cylinder("Bread side plate", target, "Linen", (0.61, 0.29, 1.05), 0.26, 0.045, vertices=12)
    torus("Bread plate ceramic lip",target,"Linen",(.61,.29,1.075),.24,.02,segments=20)
    ico("Rustic bread loaf", target, "Bread", (0.6, 0.3, 1.14), (0.22, 0.14, 0.12), subdivisions=2)
    cylinder("Picnic ceramic mug", target, "Linen", (-0.59, 0.37, 1.16), 0.12, 0.28, vertices=10)
    cylinder("Tea visible surface", target, "Roast", (-0.59, 0.37, 1.306), 0.092, 0.01, vertices=10)
    torus("Mug ceramic loop handle",target,"Linen",(-.75,.37,1.17),.095,.022,rotation=(pi/2,0,0),segments=20)
    for x in (-.65,.64):
        beam("Picnic polished cutlery handle",target,"Silver",(x,-.35,1.035),(x,-.05,1.035),.025)
    for x in (-.70,-.65,-.60):
        beam("Fork tine",target,"Silver",(x,-.06,1.035),(x,.10,1.035),.009)
    box("Picnic woven basket bottom",target,"Wood",(-.97,-1.01,.16),(.68,.48,.12),bevel=.035)
    for level in range(5):
        for y in (-1.25,-.77):
            box("Basket horizontal wicker slat",target,"Wood sun",(-.97,y,.2+level*.06),(.71,.035,.04),bevel=.008)
        for x in (-1.31,-.63):
            box("Basket end wicker slat",target,"Wood sun",(x,-1.01,.2+level*.06),(.035,.49,.04),bevel=.008)
    for x in (-1.26,-1.08,-.87,-.68):
        for y in (-1.26,-.76):
            beam("Basket upright weave",target,"Bark",(x,y,.14),(x,y,.5),.015)
    for n,(x,y) in enumerate(((-1.17,-1.08),(-.96,-.94),(-.77,-1.1),(-1.04,-1.13))):
        ico("Basket orchard fruit",target,("Coral","Grass sun","Ochre")[n%3],(x,y,.48),(.1,.11,.11),subdivisions=2)
    for n in range(48):
        angle = -.38 + n / 47 * pi * 1.78
        if sin(angle)>.72:
            continue
        radius = 1.64 + (n % 4) * .15
        x,y,height=radius*cos(angle),radius*sin(angle),RNG.uniform(.56,.96)
        beam("Wheat stem", target, "Wheat", (x, y, 0.02), (x + 0.07, y, height), 0.018)
        for level in range(3):
            for side in (-1, 1):
                ico("Faceted wheat grain", target, "Wheat sun", (x + 0.07 + side * 0.055, y, height - level * 0.09), (0.04, 0.045, 0.09))
    fence(target, [(-1.85, 0.7), (-1.39, 1.72), (-0.25, 2.08)])
    tree(target, (1.72, 1.39, 0), 2.12, "oak")
    fence(target,[(-.61,-2.19),(.55,-2.07),(1.65,-1.54)])
    torus("Woven picnic basket arch handle",target,"Wood sun",(-.97,-1.01,.52),.34,.036,
          rotation=(pi/2,0,0),segments=24)
    for bx,by in ((-1.9,.25),(1.69,-.98)):
        for n in range(7):
            a=n*2*pi/7
            x,y=bx+.11*cos(a),by+.10*sin(a)
            h=1.06+.16*sin(n*1.4)
            beam("Bound harvest sheaf stem",target,"Wheat",(x,y,.02),(x+.10*cos(a),y+.09*sin(a),h),.025)
            for level in range(3):
                ico("Harvest sheaf full grain head",target,"Wheat sun",
                    (x+.10*cos(a),y+.09*sin(a),h-level*.1),(.08,.07,.12))
        torus("Harvest sheaf binding",target,"Bark",(bx,by,.4),.15,.028,segments=16)


def travel(target):
    terrace(target,"travel")
    rock(target, (-.66, 1.19, .88), (1.15,.84,1.3), "teal")
    rock(target, (.36,1.70,.82), (.77,.7,1.16), "teal")
    tree(target, (-1.5, 1.43, 0), 2.95)
    tree(target, (1.51, 1.26, 0), 3.4)
    tree(target, (1.74, -0.55, 0), 1.6)
    tree(target, (-1.85,-1.19,0),1.85)
    tree(target, (.63,2.09,0),2.7)
    box("Hard-shell teal suitcase", target, "Suitcase", (-0.51, -0.24, 0.88), (1.01, 0.58, 1.53), bevel=0.12)
    box("Suitcase center seam", target, "Pine deep", (-0.51, -0.244, 0.88), (1.028, 0.06, 1.4), bevel=0.075)
    for x in (-0.82, -0.6, -0.38, -0.16):
        box("Suitcase raised shell rib", target, "Suitcase light", (x, -0.539, 0.89), (0.055, 0.04, 1.1), bevel=0.02)
    for x in (-0.78, -0.23):
        beam("Suitcase telescopic rail", target, "Silver", (x, -0.14, 1.58), (x, -0.14, 2.05), 0.035)
        cylinder("Suitcase wheel", target, "Charcoal", (x, -0.25, 0.11), 0.13, 0.13, rotation=(pi / 2, 0, 0))
    box("Suitcase carry grip", target, "Charcoal", (-0.505, -0.14, 2.06), (0.67, 0.14, 0.12), bevel=0.035)
    box("Suitcase gold luggage tag", target, "Ochre", (-0.11, -0.579, 1.31), (0.2, 0.04, 0.29), rotation=(0, -0.18, 0), bevel=0.025)
    for x in (-.91,-.11):
        for z in (.23,1.52):
            box("Suitcase reinforced leather corner",target,"Bark",(x,-.54,z),(.16,.07,.19),bevel=.05)
    cylinder("Suitcase round travel badge",target,"Ochre",(-.55,-.579,.79),.14,.028,vertices=16,rotation=(pi/2,0,0))
    ico("Travel badge mountain emblem",target,"Linen",(-.55,-.603,.8),(.085,.016,.08))
    torus("Luggage tag brass eyelet",target,"Silver",(-.11,-.603,1.4),.026,.009,rotation=(pi/2,0,0),segments=16)
    box("Compact travel camera body",target,"Charcoal",(.62,-.92,.21),(.43,.24,.29),bevel=.045)
    cylinder("Camera lens barrel",target,"Iron",(.62,-1.10,.21),.13,.2,vertices=16,rotation=(pi/2,0,0))
    cylinder("Camera glass lens",target,"Lens",(.62,-1.21,.21),.10,.015,vertices=16,rotation=(pi/2,0,0))
    box("Travel timber signpost", target, "Wood", (0.68, 0.03, 1.07), (0.17, 0.18, 2.08), bevel=0.025)
    for z, direction, color in ((1.93, 1, "Sky sign"), (1.52, -1, "Grass shade"), (1.11, 1, "Ochre")):
        x, y = 0.68, -0.11
        vertices = [(x - 0.63, y, z - 0.14), (x + 0.5, y, z - 0.14), (x + 0.75, y, z),
                    (x + 0.5, y, z + 0.14), (x - 0.63, y, z + 0.14)]
        board = mesh("Colorful directional arrow", target, color,
                     [(x + (vx - x) * direction, vy, vz) for vx, vy, vz in vertices], ((0, 1, 2, 3, 4),))
        modifier = board.modifiers.new("Wood board thickness", "SOLIDIFY")
        modifier.thickness = 0.09
        bpy.context.view_layer.objects.active = board
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    for x, z in ((0.55, 1.93), (0.71, 1.52), (0.55, 1.11)):
        ico("Travel sign compass diamond", target, "Linen", (x, -0.175, z), (0.08, 0.025, 0.09))
    for obj in target.objects:
        if obj.name.startswith(("Travel timber signpost","Colorful directional arrow","Travel sign compass")):
            obj.location.z*=1.22
            if obj.name.startswith("Travel timber"):
                obj.scale.z*=1.22
            else:
                for vertex in obj.data.vertices:
                    vertex.co.z*=1.22
    rock(target,(1.55,-1.54,.32),(.73,.6,.76),"teal")
    tree(target,(2.5,-.4,0),2.02)
    box("Leather overnight bag",target,"Bark",(.32,-.87,.38),(.65,.48,.62),rotation=(0,0,-.18),bevel=.12)
    for x in (.13,.48):
        box("Overnight bag canvas strap",target,"Linen",(x,-1.12,.38),(.055,.025,.44),bevel=.01)
    torus("Overnight bag carry loop",target,"Wood",(.30,-.86,.74),.14,.028,rotation=(pi/2,0,0),segments=16)


def region_detail(name,target):
    """Dress each destination with layered, biome-specific original story props."""
    inward=-Vector(STATIONS[name]).normalized()
    for n in range(11):
        a=n*2.39996+.4
        direction=Vector((cos(a),sin(a)))
        if direction.dot(inward)>.70:
            continue
        r=2.38+.11*(n%3)
        x,y=r*cos(a),r*sin(a)
        if name=="fitness":
            if n%3==0:
                cactus(target,(x,y,0),.75+.15*(n%4))
            else:
                meadow_cluster(target,(x,y,0),.6)
        else:
            meadow_cluster(target,(x,y,0),.65+.13*(n%3),
                           "Flower purple" if name=="gaming" else "Flower gold" if name=="food" else "Flower white")
            if n%3==1:
                shrub(target,(x+.15,y,.01),.72,"violet" if name=="gaming" else "teal" if name=="travel" else "green")
    if name=="fitness":
        rock(target,(-2.05,1.72,.5),(1.0,.85,1.2),"red")
        rock(target,(1.45,1.91,.45),(.8,.77,1.07),"red")
        banner(target,(-2.45,-.23,0),"Banner red","fitness")
        for x,y in ((.85,-1.11),(1.38,-.7)):
            cylinder("Dumbbell knurled handle",target,"Silver",(x,y,.2),.042,.48,vertices=12,rotation=(0,pi/2,.2))
            for side in (-1,1):
                cylinder("Dumbbell hexagonal weight",target,"Charcoal",(x+side*.24,y,.2),.16,.16,vertices=6,rotation=(0,pi/2,0))
        for x in (-1.59,-1.36,.68,.91):
            torus("Barbell outer milled plate groove",target,"Red shade",(x,-.05,1.76),.31,.014,
                  rotation=(0,pi/2,0),segments=32)
        posts=[(.95,2.04),(1.77,1.62),(2.16,.84)]
        for x,y in posts:
            cylinder("Training rope fence post",target,"Wood",(x,y,.67),.085,1.34,vertices=9)
        for a,b in zip(posts,posts[1:]):
            for n in range(8):
                p=n/8
                q=(n+1)/8
                beam("Sagging training rope",target,"Rope",(a[0]*(1-p)+b[0]*p,a[1]*(1-p)+b[1]*p,1.06-.16*sin(pi*p)),
                     (a[0]*(1-q)+b[0]*q,a[1]*(1-q)+b[1]*q,1.06-.16*sin(pi*q)),.025)
    elif name=="gaming":
        for x,y,h in ((-2.55,.25,2.1),(2.56,.67,2.6),(-2.16,-1.20,1.5)):
            tree(target,(x,y,0),h,"violet")
        for n in range(4):
            box("Ancient stepped ruin perimeter",target,"Indigo stone",(-.75+n*.54,1.92,.16),(.51,.57,.3),rotation=(0,0,n*.04),bevel=.04)
        box("Forgotten treasure chest box",target,"Wood",(.87,-.58,.30),(.68,.49,.48),bevel=.045)
        loft("Rounded treasure chest lid",target,"Bark",[(.87,-.58,.54,.35,.26),(.87,-.58,.67,.31,.23),
             (.87,-.58,.74,.19,.16)],segments=12)
        for x in (.60,1.13):
            box("Treasure chest brass reinforcement",target,"Ochre",(x,-.839,.36),(.06,.035,.51),bevel=.012)
        box("Treasure chest square lock",target,"Ochre",(.87,-.85,.39),(.14,.04,.16),bevel=.02)
        cylinder("Treasure chest keyhole",target,"Midnight",(.87,-.88,.4),.026,.025,vertices=8,rotation=(pi/2,0,0))
        for x,y in ((-1.9,-1.73),(2.16,-.74),(-1.02,1.79)):
            rock(target,(x,y,.12),(.28,.33,.27),"violet")
    elif name=="food":
        for bx,by in ((-1.8,-1.32),(1.83,-.81),(-1.32,1.75),(.92,-1.93)):
            for n in range(11):
                a=n*2.39996
                x,y=bx+.27*cos(a),by+.24*sin(a)
                height=.70+.18*(n%3)
                beam("Golden field wheat stalk",target,"Wheat",(x,y,.02),(x+.055,y,height),.02)
                for level in range(4):
                    for side in (-1,1):
                        ico("Ripe golden field ear",target,"Wheat sun",(x+.055+side*.04,y,height-level*.075),(.035,.047,.085))
        for x,y in ((.25,.11),(.38,.06),(.37,.23)):
            ico("Fresh broccoli side florets",target,"Grass shade",(x,y,1.16),(.09,.075,.09),subdivisions=2)
        for x in (-.3,-.15,0):
            box("Roast glazed scoring",target,"Bread",(x,-.14,1.275),(.055,.18,.018),rotation=(0,.1,-.3),bevel=.008)
        for n in range(4):
            x=-1.2+.14*n
            ico("Basket fresh orchard apples",target,"Coral" if n%2 else "Grass sun",(x,-1.06,.57),(.105,.105,.11),subdivisions=2)
            beam("Apple short stalk",target,"Bark",(x,-1.06,.65),(x+.01,-1.06,.71),.011)
        for x,y in ((-.86,.55),(.8,-.52)):
            cylinder("Second cream side plate",target,"Linen",(x,y,1.06),.19,.035,vertices=16)
            ico("Side plate warm bread roll",target,"Bread",(x,y,1.12),(.13,.12,.075),subdivisions=2)
    else:
        banner(target,(2.27,.44,0),"Banner teal","travel")
        box("Second hard-shell cabin case",target,"Sky sign",(.55,.34,.64),(.71,.5,1.13),bevel=.09)
        for x in (.32,.53,.74):
            box("Cabin case formed ribs",target,"Suitcase light",(x,.075,.65),(.04,.033,.82),bevel=.018)
        for x in (.31,.77):
            cylinder("Cabin luggage wheel",target,"Charcoal",(x,.3,.10),.105,.1,vertices=12,rotation=(pi/2,0,0))
            beam("Cabin case handle tube",target,"Silver",(x,.37,1.19),(x,.37,1.57),.025)
        box("Cabin case top grip",target,"Charcoal",(.54,.37,1.58),(.53,.1,.09),bevel=.025)
        for x,z,color in ((-.77,.49,"Banner red"),(-.34,1.02,"Sky sign"),(-.45,.37,"Ochre")):
            box("Collected suitcase travel sticker",target,color,(x,-.587,z),(.18,.016,.16),rotation=(0,.08,x),bevel=.025)
            mesh("Travel sticker mountain silhouette",target,"Linen",[(x-.06,-.6,z-.045),(x+.055,-.6,z-.04),
                 (x+.015,-.6,z+.05),(x-.015,-.6,z+.018)],[(0,1,2),(0,2,3)])
        for obj in target.objects:
            if obj.name.startswith(("Compact travel camera","Camera lens barrel","Camera glass lens")):
                obj.location+=Vector((-.5,-.62,0))
        for x,y,h in ((2.58,1.45,2.2),(.3,2.55,2.6),(-2.35,.40,1.7)):
            tree(target,(x,y,0),h)


def avatar(target):
    """Sculpt an organic faceted adventurer with tapered limbs and blended joints."""
    parts={}
    joint_blends={}

    def part(bone,obj,blend=None):
        parts.setdefault(bone,[]).append(obj)
        if blend:
            joint_blends[obj.name]=blend
        return obj

    for side,x in (("L",-.22),("R",.22)):
        shift=.018 if x<0 else -.018
        leg=loft(f"Contoured denim leg {side}",target,"Denim",
                 [(x,.01+shift,.23,.115,.115),(x,.02+shift,.32,.123,.127),
                  (x,.04,.44,.145,.14),(x,.055,.55,.152,.139),
                  (x,.035,.61,.147,.143),(x,.016,.68,.155,.153),
                  (x,.005,.81,.175,.169),(x*.95,.012,.96,.185,.183),
                  (x*.89,.025,1.075,.186,.178)],segments=18)
        part(f"Leg.{side}",leg,(f"Shin.{side}",.61,.12))
        part(f"Shin.{side}",loft(f"Rolled jean cuff {side}",target,"Denim light",
             [(x,.01+shift,.25,.123,.126),(x,.01+shift,.29,.137,.141),(x,.01+shift,.325,.125,.126)],segments=18))
        part(f"Shin.{side}",loft(f"Shaped sneaker upper {side}",target,"Charcoal",
             [(x,-.075+shift,.05,.161,.26),(x,-.083+shift,.11,.159,.268),
              (x,-.069+shift,.15,.15,.254),(x,-.034+shift,.21,.131,.182),
              (x,.014+shift,.26,.116,.12)],segments=18))
        part(f"Shin.{side}",loft(f"Sneaker rubber welt {side}",target,"Linen",
             [(x,-.075+shift,0,.154,.25),(x,-.075+shift,.027,.166,.268),
              (x,-.075+shift,.057,.161,.265)],segments=18))
        for n in range(4):
            y=-.19+n*.052+shift
            z=.183+n*.017
            part(f"Shin.{side}",beam("Crossed cotton sneaker lace",target,"Linen",(x-.085,y,z),(x+.085,y+.025,z),.009))
        part(f"Shin.{side}",loft("Canvas shoe tongue",target,"Jacket highlight",
             [(x,-.118+shift,.19,.071,.047),(x,-.04+shift,.25,.066,.029)],segments=10))
    part("Hips",loft("Natural denim hip volume",target,"Denim",
         [(0,.015,.95,.29,.175),(0,.015,1.045,.332,.195),(0,.012,1.105,.30,.176)],segments=18))
    part("Body",loft("Draped white T-shirt",target,"Shirt",
         [(0,-.02,1.035,.244,.16),(0,-.025,1.09,.251,.168),(0,-.03,1.24,.255,.176),
          (0,-.025,1.40,.267,.172),(0,-.014,1.54,.252,.155),(0,-.012,1.61,.17,.119)],segments=20))
    part("Body",loft("Open shell jacket contoured torso",target,"Jacket",
         [(0,.018,1.015,.329,.231),(0,.016,1.07,.346,.245),(0,.012,1.20,.331,.255),
          (0,.008,1.37,.362,.267),(0,.009,1.49,.386,.255),(0,.012,1.57,.349,.216),
          (0,.025,1.61,.27,.171)],segments=24,arc=2*pi-.99))
    part("Body",loft("Jacket sculpted rear hood",target,"Jacket highlight",
         [(0,.09,1.54,.239,.189),(0,.099,1.61,.247,.204),(0,.075,1.72,.204,.177)],
         segments=18,arc=2*pi-1.45))
    for side,sign in (("L",-1),("R",1)):
        sleeve=loft(f"Tapered bent shell sleeve {side}",target,"Jacket",
             [(sign*.515,-.035,.935,.099,.112),(sign*.519,-.027,1.02,.115,.13),
              (sign*.51,-.003,1.12,.123,.146),(sign*.484,.02,1.21,.13,.143),
              (sign*.475,.025,1.25,.142,.15),(sign*.443,.008,1.37,.158,.166),
              (sign*.398,.005,1.49,.174,.178),(sign*.362,.012,1.58,.135,.139),
              (sign*.35,.011,1.615,.067,.081)],segments=18)
        part(f"Arm.{side}",sleeve,(f"Forearm.{side}",1.23,.115))
        part(f"Forearm.{side}",loft("Elastic shell wrist cuff",target,"Jacket highlight",
             [(sign*.515,-.035,.927,.103,.113),(sign*.515,-.035,.974,.115,.122)],segments=16))
        part(f"Forearm.{side}",ico("Sculpted palm and knuckles",target,"Skin",
             (sign*.515,-.04,.842),(.095,.071,.13),subdivisions=2))
        part(f"Forearm.{side}",ico("Curled natural thumb",target,"Skin",
             (sign*.451,-.086,.867),(.046,.051,.074),subdivisions=2))
        for finger in range(3):
            part(f"Forearm.{side}",ico("Rounded joined fingertips",target,"Skin",
                 (sign*(.486+finger*.03),-.049,.765+(finger%2)*.008),(.031,.045,.034),subdivisions=2))
        zipper=[(sign*.16,-.196,1.045),(sign*.158,-.212,1.2),(sign*.172,-.225,1.37),
                (sign*.182,-.216,1.49),(sign*.17,-.187,1.56)]
        for a,b in zip(zipper,zipper[1:]):
            part("Body",beam("Fine jacket front zip",target,"Iron",a,b,.008))
        lapel=mesh("Folded shell collar lapel",target,"Jacket highlight",
              [(sign*.14,-.244,1.48),(sign*.29,-.216,1.54),(sign*.215,-.21,1.66),(sign*.108,-.225,1.59)],
              [(0,1,2),(0,2,3)])
        solid=lapel.modifiers.new("Folded collar thickness","SOLIDIFY")
        solid.thickness=.021
        bpy.context.view_layer.objects.active=lapel
        bpy.ops.object.modifier_apply(modifier=solid.name)
        part("Body",lapel)
        part("Body",beam("Angled shell pocket welt",target,"Jacket highlight",
             (sign*.245,-.188,1.17),(sign*.29,-.159,1.27),.017))
    part("Body",loft("Soft compact hiking backpack",target,"Backpack",
         [(0,.31,1.05,.178,.105),(0,.332,1.12,.239,.148),(0,.344,1.35,.251,.16),
          (0,.33,1.53,.224,.137),(0,.31,1.61,.125,.081)],segments=18))
    part("Body",loft("Curved backpack outer pocket",target,"Jacket highlight",
         [(0,.457,1.11,.16,.058),(0,.474,1.25,.18,.071),(0,.452,1.33,.159,.053)],segments=14))
    for x in (-.22,.22):
        part("Body",beam("Backpack shoulder strap",target,"Backpack",(x,-.105,1.58),(x,.327,1.60),.033))
    part("Head",loft("Neck and jaw transition",target,"Skin",
         [(0,.018,1.58,.104,.099),(0,.013,1.70,.119,.105)],segments=16))
    part("Head",loft("Sculpted cheek planes chin and forehead",target,"Skin",
         [(0,-.014,1.665,.124,.12),(0,-.028,1.715,.20,.169),(0,-.017,1.785,.26,.203),
          (0,0,1.87,.294,.225),(0,.009,1.975,.327,.233),(0,.018,2.074,.323,.231),
          (0,.022,2.166,.292,.213),(0,.025,2.225,.203,.161),(0,.025,2.248,.084,.09)],segments=22))
    for x in (-.324,.324):
        part("Head",ico("Sculpted faceted ear",target,"Skin",(x,.015,1.956),(.071,.065,.12),subdivisions=2))
        part("Head",ico("Ear inner cartilage",target,"Skin shade",(x*1.075,-.027,1.966),(.027,.025,.069),subdivisions=2))
    part("Head",mesh("Small sculpted bridge and nose tip",target,"Skin",
         [(-.041,-.226,2.005),(.041,-.226,2.005),(-.052,-.231,1.897),(.052,-.231,1.897),
          (-.032,-.302,1.924),(.032,-.302,1.924),(0,-.274,1.995),(0,-.255,1.883)],
         [(0,1,6),(0,6,4),(6,1,5),(4,6,5),(0,4,2),(1,3,5),(2,4,7),(4,5,7),(5,3,7)]))
    for a,b in (((-.064,-.212,1.792),(0,-.22,1.785)),((0,-.22,1.785),(.064,-.212,1.799))):
        part("Head",beam("Subtle natural smile",target,"Smile",a,b,.006))
    part("Head",loft("Short swept black hair crown",target,"Hair",
         [(0,.09,2.04,.284,.204),(0,.045,2.15,.328,.251),(0,.035,2.255,.327,.254),
          (-.012,.025,2.34,.26,.216),(-.022,.036,2.395,.13,.137),(-.03,.025,2.421,.035,.038)],segments=20))
    for n in range(7):
        x=-.275+n*.083
        part("Head",mesh("Chiseled swept fringe lock",target,"Hair",
             [(x-.063,-.16,2.31),(x+.063,-.16,2.32),(x+.09,-.246,2.15),
              (x+.016,-.258,2.085+(n%3)*.025),(x-.058,-.231,2.20),(x+.012,-.283,2.22)],
             [(0,1,5),(1,2,5),(2,3,5),(3,4,5),(4,0,5),(0,4,3,2,1)]))
    for x in (-.162,.162):
        outer=[(-.155,-.058),(-.134,-.085),(.126,-.079),(.151,-.057),(.151,.06),(.13,.084),(-.133,.084),(-.155,.06)]
        inner=[(u*.845,v*.73) for u,v in outer]
        vertices=[(x+u,y,2.018+v) for y,points in ((-.275,outer),(-.275,inner),(-.245,outer),(-.245,inner)) for u,v in points]
        faces=[]
        for n in range(8):
            b=(n+1)%8
            faces.extend(((n,b,8+b,8+n),(n,16+n,16+b,b),(8+n,8+b,24+b,24+n),(16+n,24+n,24+b,16+b)))
        part("Head",mesh("Thin square black sunglasses frame",target,"Charcoal",vertices,faces))
        part("Head",box("Inset smoky sunglass lens",target,"Lens",(x,-.259,2.02),(.256,.019,.117),bevel=.018))
        part("Head",beam("Slender sunglasses temple",target,"Charcoal",(x*1.87,-.248,2.055),(x*2.01,.09,2.025),.015))
    part("Head",beam("Sunglasses bridge",target,"Charcoal",(-.025,-.27,2.051),(.025,-.27,2.051),.014))
    necklace=[(-.115,-.166,1.598),(-.1,-.236,1.485),(-.052,-.265,1.394),(0,-.27,1.359),
              (.06,-.262,1.41),(.105,-.221,1.509),(.117,-.161,1.598)]
    for a,b in zip(necklace,necklace[1:]):
        part("Body",beam("Silver necklace fine chain",target,"Silver",a,b,.009))
    part("Body",ico("Small silver pendant",target,"Silver",(0,-.275,1.344),(.028,.016,.04),subdivisions=2))
    armature = bpy.data.armatures.new("Tabletop adventurer skeleton")
    rig = bpy.data.objects.new("Avatar", armature)
    target.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bones = {"Root": ((0, 0, 0), (0, 0, 0.4), None), "Hips": ((0,0,.94),(0,0,1.1),"Root"), "Body": ((0,0,1.09),(0,0,1.62),"Hips"),
             "Head": ((0,0,1.64),(0,0,2.30),"Body")}
    for side, x in (("L", -.22), ("R", .22)):
        bones[f"Leg.{side}"] = ((x,.015,1.04),(x,.035,.61),"Hips")
        bones[f"Shin.{side}"] = ((x,.035,.61),(x,.01,.21),f"Leg.{side}")
        bones[f"Arm.{side}"] = ((x*1.73,0,1.59),(x*2.18,.025,1.23),"Body")
        bones[f"Forearm.{side}"] = ((x*2.18,.025,1.23),(x*2.32,-.035,.93),f"Arm.{side}")
    for name, (head, tail, parent) in bones.items():
        bone = armature.edit_bones.new(name)
        bone.head, bone.tail = head, tail
        if parent:
            bone.parent = armature.edit_bones[parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    for name, objects in parts.items():
        for obj in objects:
            group = obj.vertex_groups.new(name=name)
            if obj.name in joint_blends:
                other,joint_z,spread=joint_blends[obj.name]
                lower=obj.vertex_groups.new(name=other)
                for vertex in obj.data.vertices:
                    z=(obj.matrix_world @ vertex.co).z
                    t=min(1,max(0,(joint_z+spread-z)/(2*spread)))
                    weight=t*t*(3-2*t)
                    group.add([vertex.index],1-weight,"REPLACE")
                    lower.add([vertex.index],weight,"REPLACE")
            else:
                group.add(list(range(len(obj.data.vertices))),1.0,"REPLACE")
            obj.modifiers.new("Blended elbow and knee deformation", "ARMATURE").object = rig
            obj.parent = rig
    rig.animation_data_create()
    for clip, frames in (("Idle", 61), ("Walk", 25), ("Arrive", 37)):
        action = bpy.data.actions.new(clip)
        rig.animation_data.action = action
        for frame in range(1, frames + 1, 3):
            t = (frame - 1) / (frames - 1)
            for pose in rig.pose.bones:
                pose.rotation_mode = "XYZ"
                pose.rotation_euler, pose.location = (0, 0, 0), (0, 0, 0)
            if clip == "Walk":
                stride = sin(t * 2 * pi)
                rig.pose.bones["Root"].location.y = .036 * (1-cos(t*4*pi))
                rig.pose.bones["Hips"].rotation_euler.y = -.075*stride
                rig.pose.bones["Hips"].rotation_euler.z = .035*stride
                rig.pose.bones["Body"].rotation_euler.x = -.045
                rig.pose.bones["Body"].rotation_euler.y = .13*stride
                for side, sign in (("L", 1), ("R", -1)):
                    rig.pose.bones[f"Leg.{side}"].rotation_euler.x = .43 * stride * sign
                    rig.pose.bones[f"Shin.{side}"].rotation_euler.x = .09 + max(0,-stride*sign)*.60
                    rig.pose.bones[f"Arm.{side}"].rotation_euler.x = -.33*stride*sign
                    rig.pose.bones[f"Forearm.{side}"].rotation_euler.x = -.20-.13*max(0,stride*sign)
            elif clip == "Idle":
                rig.pose.bones["Body"].location.y = .012*sin(t*2*pi)
                rig.pose.bones["Hips"].rotation_euler.y = .022*sin(t*2*pi)
                rig.pose.bones["Forearm.L"].rotation_euler.x = -.06
                rig.pose.bones["Forearm.R"].rotation_euler.x = -.085
                rig.pose.bones["Head"].rotation_euler.y = 0.055 * sin(t * 2 * pi)
                rig.pose.bones["Arm.L"].rotation_euler.x = 0.022 * sin(t * 2 * pi)
            else:
                greeting = sin(t * pi) ** 2
                rig.pose.bones["Head"].rotation_euler.x = 0.12 * greeting
                rig.pose.bones["Arm.R"].rotation_euler.z = -0.85 * greeting
                rig.pose.bones["Forearm.R"].rotation_euler.x = -0.5 * greeting
                rig.pose.bones["Body"].rotation_euler.y = 0.08 * greeting
            for pose in rig.pose.bones:
                pose.keyframe_insert("rotation_euler", frame=frame, group=pose.name)
                pose.keyframe_insert("location", frame=frame, group=pose.name)
        rig.animation_data.action = None
        track = rig.animation_data.nla_tracks.new()
        track.name = clip
        track.strips.new(clip, 1, action)
        track.mute = True
    for pose in rig.pose.bones:
        pose.rotation_euler, pose.location = (0, 0, 0), (0, 0, 0)
    return rig


def setup_palette():
    colors = {
        "Grass": (0.27, 0.43, 0.055), "Grass light": (0.33, 0.49, 0.075), "Grass sun": (0.43, 0.55, 0.10),
        "Grass shade": (0.31, 0.46, 0.1), "Grass olive": (0.37, 0.46, 0.12), "Leaf dark": (0.19, 0.39, 0.12),
        "Rock": (0.35, 0.32, 0.34), "Rock shade": (0.25, 0.29, 0.32), "Rock sun": (0.52, 0.47, 0.41),
        "Rock mauve": (0.42, 0.36, 0.4), "Rock warm": (0.6, 0.49, 0.35), "Camp stone": (0.58, 0.49, 0.39),
        "Path": (0.79, 0.62, 0.33), "Path sun": (0.89, 0.71, 0.43), "Path peach": (0.83, 0.59, 0.33),
        "Bark": (0.26, 0.13, 0.07), "Wood": (0.46, 0.25, 0.1), "Wood sun": (0.66, 0.4, 0.18),
        "Pine deep": (0.025, 0.22, 0.22), "Pine": (0.04, 0.36, 0.32), "Pine sun": (0.12, 0.47, 0.38),
        "Red rock": (0.64, 0.1, 0.035), "Red sun": (0.86, 0.21, 0.065), "Red shade": (0.5, 0.06, 0.04),
        "Red sand": (0.72, 0.44, 0.2), "Coral": (0.79, 0.12, 0.08), "Ochre": (0.95, 0.58, 0.12),
        "Indigo": (0.075, 0.045, 0.27), "Violet": (0.26, 0.065, 0.48), "Lavender": (0.46, 0.16, 0.61),
        "Violet stone": (0.36, 0.29, 0.45), "Lavender stone": (0.49, 0.42, 0.56), "Indigo stone": (0.23, 0.22, 0.33),
        "Midnight": (0.025, 0.035, 0.07), "Wheat earth": (0.69, 0.52, 0.14), "Wheat": (0.84, 0.58, 0.12),
        "Wheat sun": (1, 0.73, 0.18), "Linen": (0.91, 0.86, 0.7), "Blanket red": (0.75, 0.23, 0.13),
        "Roast": (0.49, 0.13, 0.06), "Potato": (0.97, 0.63, 0.17), "Bread": (0.65, 0.33, 0.1),
        "Teal stone": (0.23, 0.42, 0.34), "Teal sun": (0.39, 0.55, 0.4), "Teal ground": (0.23, 0.47, 0.34),
        "Suitcase": (0.025, 0.36, 0.39), "Suitcase light": (0.06, 0.48, 0.47), "Sky sign": (0.13, 0.39, 0.62),
        "Charcoal": (0.038, 0.045, 0.055), "Iron": (0.14, 0.18, 0.2), "Shirt": (0.91, 0.92, 0.87),
        "Jacket": (0.025, 0.033, 0.045), "Jacket highlight": (0.065, 0.08, 0.095), "Backpack": (0.035, 0.042, 0.05),
        "Denim": (0.065, 0.21, 0.37), "Denim light": (0.12, 0.3, 0.47), "Skin": (0.68, 0.43, 0.29),
        "Hair": (0.015, 0.022, 0.029), "Smile": (0.32, 0.14, 0.1), "Skin shade": (.49,.255,.15),
    }
    for name, color in colors.items():
        material(name, color)
    for name,roughness in {"Jacket":.59,"Jacket highlight":.64,"Backpack":.77,"Skin":.71,
                           "Hair":.68,"Denim":.94,"Denim light":.92,"Iron":.43,"Charcoal":.7,
                           "Linen":.62,"Wood":.88,"Wood sun":.84}.items():
        PALETTE[name].node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value=roughness
    material("Collider",(0,0,0))
    PALETTE["Collider"].node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value=0
    PALETTE["Collider"].diffuse_color=(0,0,0,0)
    material("Silver", (0.6, 0.67, 0.71), roughness=0.3, metallic=0.7)
    material("Lens", (0.035, 0.072, 0.092), roughness=0.23, metallic=0.12)
    material("Screen", (0.013, 0.17, 0.23), roughness=0.45, glow=0.3)
    material("Screen light", (0.19, 0.88, 0.99), glow=1)
    material("Flame", (1, 0.29, 0.025), glow=0.4)
    material("Flame light", (1, 0.71, 0.065), glow=0.7)
    material("Sign oak", (0.20, 0.078, 0.024))
    material("Sign oak sun", (0.25, 0.108, 0.04))
    material("Sign endgrain", (0.105, 0.038, 0.011))
    material("Sign grain", (0.14, 0.051, 0.014))
    material("Sign ivory lettering", (0.97, 0.965, 0.91))
    material("Sign ivory letter edges", (0.49, 0.43, 0.31))
    for name,color in {"Water":(.015,.38,.72),"Water deep":(.012,.34,.66),
                       "Water teal":(.023,.42,.74),"Water sun":(.052,.47,.80),"Foam":(.73,.88,.98),
                       "Cloud":(.98,.98,1.0),"Cloud shade":(.67,.72,.88),
                       "Flower white":(.94,.94,.85),"Flower gold":(1,.62,.025),"Flower purple":(.56,.21,.75),
                       "Cactus":(.17,.36,.08),"Cactus sun":(.30,.50,.10),"Rope":(.51,.37,.18),
                       "Banner red":(.62,.035,.025),"Banner teal":(.035,.28,.45)}.items():
        material(name,color,roughness=.29 if name.startswith("Water") else .87)
    material("Coal ember",(.56,.045,.008),glow=.2)


def chunky_glyph(target, character, location, scale, index):
    """Original condensed brush-cut letters with heavy paint edges, without fonts."""
    outlines = {
        "A": [[(0,0),(.29,1),(.7,1),(1,0),(.7,0),(.63,.24),(.36,.24),(.29,0)],[(.43,.49),(.5,.77),(.57,.49)]],
        "D": [[(0,0),(.7,0),(1,.23),(1,.77),(.7,1),(0,1)],[(.28,.24),(.58,.24),(.72,.38),(.72,.62),(.58,.76),(.28,.76)]],
        "E": [[(0,0),(.95,0),(.95,.23),(.27,.23),(.27,.4),(.81,.4),(.81,.63),(.27,.63),(.27,.77),(.95,.77),(.95,1),(0,1)]],
        "F": [[(0,0),(.28,0),(.28,.4),(.8,.4),(.8,.64),(.28,.64),(.28,.76),(.96,.76),(.96,1),(0,1)]],
        "G": [[(0,.14),(.14,0),(.86,0),(1,.14),(1,.58),(.52,.58),(.52,.35),(.73,.35),(.73,.24),(.28,.24),(.28,.76),(.93,.76),(.93,1),(.14,1),(0,.86)]],
        "I": [[(.22,0),(.68,.015),(.70,1),(.26,.99)]],
        "L": [[(0,0),(.95,0),(.95,.25),(.28,.25),(.28,1),(0,1)]],
        "M": [[(0,0),(.27,0),(.27,.61),(.48,.31),(.62,.31),(.85,.61),(.85,0),(1.12,0),(1.12,1),(.84,1),(.56,.63),(.28,1),(0,1)]],
        "N": [[(0,0),(.27,0),(.27,.58),(.72,0),(1,0),(1,1),(.73,1),(.73,.42),(.28,1),(0,1)]],
        "O": [[(.16,0),(.84,0),(1,.16),(1,.84),(.84,1),(.16,1),(0,.84),(0,.16)],[(.29,.25),(.71,.25),(.74,.28),(.74,.72),(.71,.75),(.29,.75),(.26,.72),(.26,.28)]],
        "R": [[(0,0),(.27,0),(.27,.34),(.51,.34),(.72,0),(1.03,0),(.77,.41),(1,.6),(1,.8),(.79,1),(0,1)],[(.27,.59),(.64,.59),(.73,.67),(.73,.75),(.65,.8),(.27,.8)]],
        "S": [[(.1,0),(.85,0),(1,.15),(1,.52),(.85,.66),(.29,.66),(.29,.77),(.96,.77),(.96,1),(.14,1),(0,.85),(0,.49),(.14,.35),(.73,.35),(.73,.23),(.1,.23)]],
        "T": [[(.35,0),(.65,0),(.65,.75),(1,.75),(1,1),(0,1),(0,.75),(.35,.75)]],
        "V": [[(.35,0),(.66,0),(1,1),(.71,1),(.51,.33),(.29,1),(0,1)]],
        "X": [[(0,0),(.3,0),(.5,.31),(.7,0),(1,0),(.67,.5),(1,1),(.7,1),(.5,.68),(.3,1),(0,1),(.33,.5)]],
    }
    curve = bpy.data.curves.new(f"Original chunky {character} outline", "CURVE")
    curve.dimensions, curve.fill_mode = "2D", "BOTH"
    curve.extrude, curve.bevel_depth, curve.bevel_resolution, curve.resolution_u = 0.014, 0.004, 0, 1
    curve.offset=.022
    for counter, outline in enumerate(outlines[character]):
        signed_area = sum(a[0]*b[1] - b[0]*a[1] for a,b in zip(outline, outline[1:]+outline[:1]))
        if (signed_area > 0) != (counter == 0):
            outline = list(reversed(outline))
        spline = curve.splines.new("POLY")
        spline.points.add(len(outline)-1)
        for point, (x,y) in zip(spline.points, outline):
            point.co = (x-.5+.028*y+.018*sin(y*11+index),y-.5+.013*sin(x*13+index),0,1)
        spline.use_cyclic_u = True
    letters = bpy.data.objects.new(f"Original {character} raised glyph", curve)
    target.objects.link(letters)
    letters.location = location
    letters.rotation_euler = (pi/2, ((index%3)-1)*0.025, 0)
    letters.scale = (scale*.54, scale*(1+((index%2)*.035)), scale)
    curve.materials.append(PALETTE["Sign ivory lettering"])
    bpy.ops.object.select_all(action="DESELECT")
    letters.select_set(True)
    bpy.context.view_layer.objects.active = letters
    bpy.ops.object.convert(target="MESH")
    letters.data.materials.append(PALETTE["Sign ivory letter edges"])
    for face in letters.data.polygons:
        if face.normal.z < .5:
            face.material_index = 1
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)


def wooden_signs():
    """Model reusable button art as three thick oak planks and raised white glyphs."""
    for index, name in enumerate(SIGN_NAMES):
        target = collection(f"ui-{name}")
        width = 3.45 if name == "exit" else 5.85
        half = width * 0.5
        for row in range(3):
            center = 0.29 + row * 0.47
            left, right = -half + (0.07 if row == 1 else 0), half - (0.12 if row == 0 else 0)
            outline = [(left + 0.1, center - 0.22), (right - 0.1, center - 0.24),
                       (right, center - 0.13), (right - 0.04, center + 0.09),
                       (right + 0.05, center + 0.17), (right - 0.13, center + 0.22),
                       (left + 0.12, center + 0.24), (left - 0.03, center + 0.13),
                       (left + 0.04, center + 0.01), (left - 0.06, center - 0.11)]
            vertices = [(x, y, z) for y in (-0.16, 0.19) for x, z in outline]
            count = len(outline)
            faces = [tuple(range(count)), tuple(reversed(range(count, 2 * count)))]
            faces.extend((n, (n + 1) % count, (n + 1) % count + count, n + count) for n in range(count))
            plank = mesh(f"{name.upper()} hewn oak plank {row + 1}", target,
                         "Sign oak sun" if row == 1 else "Sign oak", vertices, faces)
            plank.data.materials.append(PALETTE["Sign endgrain"])
            for polygon in plank.data.polygons[1:]:
                polygon.material_index = 1
            bpy.context.view_layer.objects.active = plank
            bevel = plank.modifiers.new("Hewn plank edge cuts", "BEVEL")
            bevel.width, bevel.segments = 0.035, 1
            bpy.ops.object.modifier_apply(modifier=bevel.name)
            for strand in range(4):
                x = -half + 0.27 + strand * (width - 0.65) / 4
                z = center - 0.145 + (strand % 2) * 0.29
                length = width * (0.17 + (strand % 3) * 0.035)
                mesh("Carved directional oak grain", target, "Sign grain",
                     [(x, -0.197, z), (x + length * 0.45, -0.198, z + 0.016),
                      (x + length, -0.197, z + 0.003), (x + length * 0.48, -0.198, z - 0.012)],
                     [(0, 1, 2, 3)])
        for x in (-half + 0.18, half - 0.22):
            box("Oak rear joining batten", target, "Sign endgrain", (x, 0.22, 0.76), (0.18, 0.2, 1.56), bevel=0.035)
            for z in (0.34, 1.17):
                cylinder("Recessed square oak peg", target, "Sign endgrain", (x, -0.195, z), 0.045, 0.035,
                         vertices=4, rotation=(pi / 2, 0, 0))
        size = min(1.15, (width-.8)/(len(name)*.64))
        for letter_index, character in enumerate(name.upper()):
            chunky_glyph(target, character, ((letter_index-(len(name)-1)/2)*size*.64, -.224, .76), size, letter_index)
        for obj in target.objects:
            obj.location.x += 30 + index * 7
        target.hide_render = True


def physical_signs():
    """Place actual oak/letter meshes into each GLB, facing the desktop camera."""
    rotation=Matrix.Rotation(SIGN_YAW,4,"Z") @ Matrix.Rotation(-.16,4,"X")
    for index,name in enumerate(SIGN_NAMES[:4]):
        target=bpy.data.collections[name]
        dx,dy=PHYSICAL_SIGNS[name]
        sx,sy=STATIONS[name]
        x,y=sx+dx,sy+dy
        floor=terrain_height(x,y)+.025
        center=Vector((x,y,floor+1.45))
        transform=Matrix.Translation(center) @ rotation @ Matrix.Scale(.56,4) @ Matrix.Translation(Vector((-30-index*7,0,-.75)))
        for obj in bpy.data.collections[f"ui-{name}"].objects:
            copy=obj.copy()
            copy.data=obj.data.copy()
            copy.name=f"{name.upper()} physical sign {obj.name}"
            target.objects.link(copy)
            copy.matrix_world=transform @ obj.matrix_world
            copy.hide_render=False
        axis=Vector((cos(SIGN_YAW),sin(SIGN_YAW)))
        for side in (-1,1):
            p=Vector((x,y))+axis*(side*1.03)
            base=terrain_height(p.x,p.y)
            height=floor+1.82-base
            post=box(f"{name.upper()} planted oak signpost",target,"Sign oak",(p.x,p.y,base+height*.5),
                     (.16,.18,height),rotation=(0,0,SIGN_YAW),bevel=.025)
            rock(target,(p.x,p.y,base+.04),(.25,.21,.16))
            meadow_cluster(target,(p.x+.18,p.y+.08,base),.65)


def export(target, origin=(0, 0)):
    """Batch the disposable export mesh by material; leave source parts editable."""
    bpy.ops.object.select_all(action="DESELECT")
    roots = [obj for obj in target.objects if not obj.parent]
    offset = Vector((*origin, 0))
    if target.name=="avatar":
        offset.z=bpy.data.objects["Avatar"].location.z
    for obj in roots:
        obj.location -= offset
    temporary = collection("Export batching")
    copies = []
    for obj in target.objects:
        if obj.type == "MESH" and obj.name!="WalkableSurface":
            duplicate = obj.copy()
            duplicate.data = obj.data.copy()
            temporary.objects.link(duplicate)
            duplicate.select_set(True)
            copies.append(duplicate)
    bpy.context.view_layer.objects.active = copies[0]
    bpy.ops.object.join()
    combined = bpy.context.object
    combined.name = f"{target.name.title()} color-batched geometry"
    combined.data.name = combined.name
    collider_source=target.objects.get("WalkableSurface")
    collider_copy=None
    if collider_source:
        collider_source.name="WalkableSurface source"
        collider_copy=collider_source.copy()
        collider_copy.data=collider_source.data.copy()
        collider_copy.name="WalkableSurface"
        temporary.objects.link(collider_copy)
        collider_copy.hide_render=False
        collider_copy.select_set(True)
    for obj in target.objects:
        if obj.type == "ARMATURE":
            obj.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(EXPORTS / f"{target.name}.glb"), export_format="GLB", use_selection=True,
                             export_apply=True, export_animations=target.name == "avatar", export_animation_mode="NLA_TRACKS",
                             export_nla_strips=True, export_anim_slide_to_zero=True, export_force_sampling=True,
                             export_cameras=False, export_lights=False,export_texcoords=False)
    bpy.data.objects.remove(combined, do_unlink=True)
    if collider_copy:
        bpy.data.objects.remove(collider_copy,do_unlink=True)
        collider_source.name="WalkableSurface"
    bpy.data.collections.remove(temporary)
    for obj in roots:
        obj.location += offset


def lighting():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples, scene.cycles.use_denoising = 64, True
    scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 1536, 1024, 100
    scene.view_settings.view_transform = "Standard"
    scene.world = bpy.data.worlds.new("Clear afternoon sky")
    scene.world.use_nodes = True
    nodes, links = scene.world.node_tree.nodes, scene.world.node_tree.links
    nodes["Background"].inputs[0].default_value = (0.78, 0.8, 0.82, 1)
    nodes["Background"].inputs[1].default_value = 0.27
    sky = nodes.new("ShaderNodeBackground")
    sky.inputs[0].default_value = (0.035, 0.43, 0.79, 1)
    rays = nodes.new("ShaderNodeLightPath")
    mix = nodes.new("ShaderNodeMixShader")
    links.new(rays.outputs["Is Camera Ray"], mix.inputs[0])
    links.new(nodes["Background"].outputs[0], mix.inputs[1])
    links.new(sky.outputs[0], mix.inputs[2])
    links.new(mix.outputs[0], nodes["World Output"].inputs[0])
    bpy.ops.object.light_add(type="AREA", location=(-5, -9, 17))
    bpy.context.object.name = "Soft afternoon sunlight"
    bpy.context.object.data.energy, bpy.context.object.data.size = 1100, 5
    bpy.ops.object.light_add(type="SUN", location=(-5, -8, 12))
    bpy.context.object.name = "Warm directional afternoon sun"
    bpy.context.object.rotation_euler = (.55,-.62,-.35)
    bpy.context.object.data.energy, bpy.context.object.data.angle = 2.5, .09
    bpy.ops.object.camera_add(location=OVERVIEW_CAMERA)
    camera = bpy.context.object
    camera.name = "Compass island overview camera"
    camera.rotation_euler = (Vector(OVERVIEW_TARGET) - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.type, camera.data.ortho_scale = "ORTHO", OVERVIEW_WIDTH
    scene.camera = camera
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(PREVIEWS / "overview.png")


def validate():
    """Round-trip actual geometry, skin, labels, collision coverage and exact clips."""
    report = {}
    for name in ("world", "avatar", *STATIONS):
        path = EXPORTS / f"{name}.glb"
        assert path.stat().st_size > 0, f"Empty asset: {path}"
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=str(path))
        meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and obj.data.materials]
        triangles = sum(sum(len(face.vertices) - 2 for face in obj.data.polygons) for obj in meshes)
        materials = {mat.name for obj in meshes for mat in obj.data.materials if mat}
        assert meshes and materials, f"Missing geometry/materials: {path}"
        assert all(not image.filepath for image in bpy.data.images), f"Unexpected external texture: {path}"
        payload=path.read_bytes()
        chunk_length,chunk_type=struct.unpack_from("<II",payload,12)
        assert chunk_type==0x4E4F534A, "Missing glTF JSON chunk"
        document=json.loads(payload[20:20+chunk_length])
        primitives=sum(len(mesh["primitives"]) for mesh in document["meshes"])
        assert not document.get("images"), "Pure-color assets must not contain textures"
        report[name] = {"bytes": path.stat().st_size, "triangles": triangles, "meshes": len(meshes), "materials": len(materials), "primitives":primitives}
        if name in STATIONS:
            assert "Sign ivory lettering" in materials and "Sign oak" in materials,"Missing physical destination sign"
            sx,sy=STATIONS[name]
            dx,dy=PHYSICAL_SIGNS[name]
            report[name]["sign_local_center"]=[dx,round(terrain_height(sx+dx,sy+dy)+1.475,4),-dy]
            report[name]["sign_yaw_degrees"]=round(SIGN_YAW*180/pi,4)
        if name == "avatar":
            clips = {action.name.split("|")[-1] for action in bpy.data.actions}
            assert {"Idle", "Walk", "Arrive"} == clips, f"Unexpected animation clips: {clips}"
            assert len(document.get("skins",[]))==1, "Avatar must contain one skin"
            assert any(obj.type == "ARMATURE" for obj in bpy.context.scene.objects), "Missing avatar skeleton"
            assert all(any(mod.type == "ARMATURE" for mod in obj.modifiers) for obj in meshes), "Unskinned avatar part"
            report[name]["animations"] = sorted(clips)
            bounds = [obj.matrix_world @ Vector(corner) for obj in meshes for corner in obj.bound_box]
            height = max(p.z for p in bounds) - min(p.z for p in bounds)
            assert 3.75 < height < 4.1, f"Unexpected enlarged avatar height: {height}"
            assert abs(min(p.z for p in bounds)) < 0.05, "Avatar feet must remain at origin"
            report[name]["height"] = round(height, 4)
            report[name]["bones"]=len(next(obj for obj in bpy.context.scene.objects if obj.type=="ARMATURE").data.bones)
            report[name]["skins"]=len(document["skins"])
        if name=="world":
            collider=bpy.data.objects.get("WalkableSurface")
            assert collider and collider.type=="MESH", "Missing dedicated WalkableSurface"
            assert [mat.name for mat in collider.data.materials]==["Collider"], "Unexpected collision material"
            levels=[v.co.z for v in collider.data.vertices]
            report[name]["collider_y_range"]=[round(min(levels),4),round(max(levels),4)]
            hits={}
            ray_count=0
            for station,point in STATIONS.items():
                direction=Vector(point).normalized()
                end=direction*STOP_RADIUS
                control=end*.5+Vector((direction.y,-direction.x))*PATH_BEND
                for step in range(101):
                    t=step/100
                    p=2*(1-t)*t*control+t*t*end
                    hit,location,_,_=collider.ray_cast(Vector((p.x,p.y,10)),Vector((0,0,-1)))
                    assert hit, f"Raycast gap on {station} at t={t}"
                    ray_count+=1
                    for side in (-1,1):
                        edge=p+Vector((direction.y,-direction.x))*(side*.28)
                        hit,_,_,_=collider.ray_cast(Vector((edge.x,edge.y,10)),Vector((0,0,-1)))
                        assert hit,f"Raycast gap beside {station} at t={t}"
                        ray_count+=1
                    if step in (0,50,100):
                        hits[f"{station}:{t}"]=[round(p.x,3),round(location.z,4),round(-p.y,3)]
            report[name]["raycast_samples"]=hits
            report[name]["verified_ray_count"]=ray_count
        print(f"VERIFIED {name}: {report[name]}")
    assert SOURCE.stat().st_size > 0
    for name,dimensions in (("overview",(1536,1024)),("avatar",(1024,1024)),("avatar-walk",(1024,1024))):
        preview=PREVIEWS/f"{name}.png"
        assert preview.stat().st_size>0
        image=bpy.data.images.load(str(preview))
        assert tuple(image.size)==dimensions,f"Invalid {name} preview dimensions"
    for name in SIGN_NAMES:
        path = UI_EXPORTS / f"{name}-sign.png"
        image = bpy.data.images.load(str(path))
        expected = (384, 192) if name == "exit" else (640, 192)
        assert tuple(image.size) == expected and image.channels == 4, f"Invalid sign dimensions/channels: {name}"
        pixels = array("f", [0]) * len(image.pixels)
        image.pixels.foreach_get(pixels)
        alpha = pixels[3::4]
        assert min(alpha) == 0 and max(alpha) == 1 and any(0 < value < 1 for value in alpha), f"Missing transparent edges: {name}"
        assert 0 < path.stat().st_size < 150_000, f"Oversized sign PNG: {name}"
        print(f"VERIFIED {name}-sign.png: {expected}, RGBA, {path.stat().st_size} bytes")
    print("INNER_WORLD_REPORT " + json.dumps(report, sort_keys=True))


def portrait_previews():
    """Inspect the reference features and an actual walking pose at useful scale."""
    scene = bpy.context.scene
    for name in ("world", *STATIONS):
        bpy.data.collections[name].hide_render = True
    scene.camera.location = Vector((3.2, -7, 3.9)) * AVATAR_SCALE
    scene.camera.rotation_euler = (Vector((0, 0, 1.19 * AVATAR_SCALE)) - scene.camera.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera.data.ortho_scale = 3.8 * AVATAR_SCALE
    scene.render.resolution_x, scene.render.resolution_y = 1024, 1024
    scene.render.filepath = str(PREVIEWS / "avatar.png")
    bpy.ops.render.render(write_still=True)
    rig = bpy.data.objects["Avatar"]
    rig.animation_data.action = bpy.data.actions["Walk"]
    scene.frame_set(7)
    scene.render.filepath = str(PREVIEWS / "avatar-walk.png")
    bpy.ops.render.render(write_still=True)


def sign_previews():
    """Render genuine modeled oak and extruded letters into transparent DOM artwork."""
    scene = bpy.context.scene
    for name in ("world", "avatar", *STATIONS):
        bpy.data.collections[name].hide_render = True
    scene.render.film_transparent = True
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.compression = 100
    scene.cycles.samples = 48
    for index, name in enumerate(SIGN_NAMES):
        target = bpy.data.collections[f"ui-{name}"]
        target.hide_render = False
        origin = Vector((30 + index * 7, 0, 0.75))
        scene.camera.location = origin + Vector((0.1, -10, 1.25))
        scene.camera.rotation_euler = (origin - scene.camera.location).to_track_quat("-Z", "Y").to_euler()
        scene.camera.data.ortho_scale = 3.9 if name == "exit" else 6.4
        scene.render.resolution_x, scene.render.resolution_y = (384, 192) if name == "exit" else (640, 192)
        light = bpy.data.objects["Soft afternoon sunlight"]
        light.location = origin + Vector((-3, -5, 5))
        light.rotation_euler = (origin - light.location).to_track_quat("-Z", "Y").to_euler()
        light.data.energy, light.data.size = 500, 4
        scene.render.filepath = str(UI_EXPORTS / f"{name}-sign.png")
        bpy.ops.render.render(write_still=True)
        target.hide_render = True
def main():
    assert (ROOT / "package.json").exists(), "Run from the Profolio repository root"
    assert bpy.app.version[:2] == (5, 2), "Use the installed Blender 5.2 CLI"
    bpy.ops.wm.read_factory_settings(use_empty=True)
    setup_palette()
    world = collection("world")
    print("BUILD terrain, sea, clouds and island ecology",flush=True)
    island(world)
    waters_and_clouds(world)
    island_ecology(world)
    paths(world)
    camp(world)
    for name, builder in (("fitness", fitness), ("gaming", gaming), ("food", food), ("travel", travel)):
        print(f"BUILD {name} destination",flush=True)
        target = collection(name)
        builder(target)
        region_detail(name,target)
        for obj in target.objects:
            obj.location += Vector((*STATIONS[name],TERRACE_HEIGHTS[name]))
    print("BUILD preserved avatar and physical signs",flush=True)
    character=avatar(collection("avatar"))
    character.scale=(AVATAR_SCALE,)*3
    character.location.z=.085
    wooden_signs()
    physical_signs()
    bpy.context.scene.render.fps = 30
    bpy.context.scene.frame_set(1)
    for directory in (SOURCE.parent, EXPORTS, PREVIEWS, UI_EXPORTS):
        directory.mkdir(parents=True, exist_ok=True)
    lighting()
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE))
    for name in ("world", "avatar", *STATIONS):
        export(bpy.data.collections[name], STATIONS.get(name, (0, 0)))
    bpy.ops.render.render(write_still=True)
    portrait_previews()
    if not all((UI_EXPORTS/f"{name}-sign.png").exists() for name in SIGN_NAMES):
        sign_previews()
    validate()


if __name__ == "__main__":
    main()
