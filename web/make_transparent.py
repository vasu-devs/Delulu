
import sys
from PIL import Image

def remove_background(input_path, output_path, tolerance=30):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Green Screen Keying (Targeting Bright Green)
            # R < 100, G > 200, B < 100
            if item[1] > 200 and item[0] < 100 and item[2] < 100:
                newData.append((0, 0, 0, 0)) # Transparent
            # White Background Keying (Fallback for other assets)
            elif item[0] > 240 and item[1] > 240 and item[2] > 240:
                 newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    # Hardcoded paths based on our known assets
    base_path = "C:/Users/Vasudev Siddh/.gemini/antigravity/brain/2f1d9682-7f57-4e15-8a84-9f03de6c316f/"
    
    # Map raw generation file to public asset path
    assets = [
        # Green Screen Asset
        (base_path + "piggy_bank_green_screen_1767724381735.png", "e:/Recruitment/Finanjo/web/public/assets/rupee-roast/logo.png"),
        # White Background Assets
        (base_path + "burger_sticker_1767723051152.png", "e:/Recruitment/Finanjo/web/public/assets/rupee-roast/icon_burger.png"),
        (base_path + "taxi_sticker_1767723077436.png", "e:/Recruitment/Finanjo/web/public/assets/rupee-roast/icon_taxi.png"),
        (base_path + "shopping_bag_sticker_1767723098454.png", "e:/Recruitment/Finanjo/web/public/assets/rupee-roast/icon_bag.png"),
        (base_path + "crying_wallet_sticker_1767723121847.png", "e:/Recruitment/Finanjo/web/public/assets/rupee-roast/sticker_crying_wallet.png"),
        (base_path + "rocket_sticker_1767723011809.png", "e:/Recruitment/Finanjo/web/public/assets/rupee-roast/rocket.png"),
    ]

    for src, dst in assets:
        remove_background(src, dst, tolerance=100)
