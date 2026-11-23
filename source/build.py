"""Build static storefront pages from the shared HTML template."""
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = (ROOT / "source/storefront.html").read_text()
COLLECTIONS = [
    ("everyday-casual", "Everyday Casual", "Easy tees, polos, relaxed denim and chinos for your everyday rotation."),
    ("streetwear", "Streetwear", "Oversized layers, utility trousers and clean sneakers for the city."),
    ("office-formal", "Office & Formal", "Tailored separates, sharp shirts and smart shoes for work and after hours."),
    ("festive-wedding", "Festive & Wedding", "Embroidered kurtas, sherwanis and Nehru jackets for the celebrations ahead."),
    ("south-indian-traditional", "South Indian Traditional", "Gold-border veshtis, crisp cotton shirts and traditional sandals."),
    ("activewear", "Activewear", "Breathable training tops, lightweight shorts and gear for days on the move."),
    ("winter-rain", "Winter & Rain", "Soft knits, lightweight jackets and layers for changing weather."),
    ("lounge-essentials", "Lounge & Essentials", "Cotton pyjamas, easy joggers and comfortable pieces for time at home."),
    ("shoes-accessories", "Shoes & Accessories", "Sneakers, loafers, belts, bags and the small details that finish an outfit."),
]
NAV = [
    ("/", "Home"), ("/collections/", "Collections"), ("/new/", "New Arrivals"),
    ("/runway/", "3D Runway"), ("/lookbook/", "Lookbook"), ("/offers/", "Offers"),
]

def tile(number):
    slug, label, description = COLLECTIONS[number]
    return (f'<a class="editorial-tile" href="/collections/{slug}/">'
            f'<img src="assets/collection-{number}.webp" alt="" loading="lazy">'
            f'<div><h3>{escape(label)}</h3><p>{escape(description)}</p></div></a>')

def build(path, page, heading, description, group=-1, kicker="", catalog_title="Shop menswear"):
    is_home = page == "home"
    links = ''.join(
        f'<a href="{href}"' + (' aria-current="page"' if path == href or (href == "/collections/" and group >= 0) else "")
        + f'>{label}</a>' for href, label in NAV
    )
    category_links = ''.join(
        f'<a href="/collections/{slug}/"' + (' aria-current="page"' if index == group else "")
        + f'>{escape(label)}</a>' for index, (slug, label, _) in enumerate(COLLECTIONS)
    )
    crumb = (f'<a href="/collections/">Collections</a><span aria-hidden="true">/</span>' if group >= 0 else '') + escape(heading)
    banner = (f'<img class="page-banner" src="assets/collection-{group}.webp" alt="" fetchpriority="high">' if group >= 0 else '')
    values = {
        "page": page, "group": str(group), "title": escape(heading + " | Try the Look India") if not is_home else "Try the Look India | Men’s Fashion",
        "nav": links, "category_nav": category_links, "crumb": crumb, "heading": escape(heading), "description": escape(description),
        "banner": banner, "kicker": f'<p class="eyebrow">{escape(kicker)}</p>' if kicker else '',
        "home_tiles": ''.join(map(tile, [0, 1, 2, 3, 5, 4])) if is_home else '',
        "directory_tiles": ''.join(map(tile,range(len(COLLECTIONS)))) if page == "directory" else '',
        "catalog_title": escape(catalog_title),
        "offer_tabs": ('<div class="offer-tabs" aria-label="Budget offers">'
                       '<button type="button" data-budget="1999"><strong>Complete outfits</strong><span>Under ₹1,999</span></button>'
                       '<button type="button" data-budget="499"><strong>Everyday essentials</strong><span>Under ₹499</span></button>'
                       '<button type="button" data-budget="999"><strong>Wardrobe favourites</strong><span>Under ₹999</span></button>'
                       '</div>') if page == "offers" else "",

        "runway_script": '<script type="module" src="runway3d.js"></script>' if page == "runway" else '',
    }
    html = TEMPLATE
    for key,value in values.items():
        html = html.replace("{{" + key + "}}",value)
    if not is_home:
        head = html.index('    <div class="homepage">')
        tail = html.index('    <section class="page-intro"',head)
        html = html[:head] + html[tail:]
    output = ROOT / 'dist' / path.strip('/') / 'index.html'
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text("\n".join(line.rstrip() for line in html.splitlines()) + "\n")

build("/", "home", "Home", "")
build("/collections/", "directory", "Collections", "Find menswear by occasion, then filter by colour, size and price.", catalog_title="All menswear")
for index, (slug,label,description) in enumerate(COLLECTIONS):
    build(f"/collections/{slug}/","collection",label,description,index,catalog_title=f"Shop {label.lower()}")
build("/new/","new","New arrivals","Discover the latest layers, sharper tailoring and fresh festive pieces.",kicker="LATEST COLLECTION",catalog_title="Shop new arrivals")
build("/offers/","offers","Offers","Explore complete outfits under ₹1,999 and everyday essentials under ₹499.",kicker="SHOP BY BUDGET",catalog_title="Shop the offers")
build("/runway/","runway","The 3D runway","Drag to orbit the showroom, browse the looks and shop the pieces you like.",kicker="INTERACTIVE SHOWROOM")
build("/lookbook/","lookbook","The Lookbook","Twelve complete outfits to wear for work, weekends, weddings and everything in between.",kicker="OUTFIT INSPIRATION")
