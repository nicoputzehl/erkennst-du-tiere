#!/bin/bash

# Bild-Verarbeitungs-Tool für macOS
# Verwendung: ./image_processor.sh [Ordner-Pfad]

# Standardwerte
THUMBNAIL_SIZE=100
QUALITY=85
INPUT_DIR="${1:-.}"  # Aktueller Ordner als Standard

echo "🖼️  Bild-Verarbeitungs-Tool für macOS"
echo "📁 Arbeitsordner: $INPUT_DIR"
echo "========================================"

# Menü anzeigen
echo ""
echo "Was möchtest du tun?"
echo "1) 📱 Thumbnails erstellen (100x100px in separatem Ordner)"
echo "2) ⚡ Bilder optimieren (Original-Dateien verbessern)"
echo "3) ❌ Abbrechen"
echo ""
read -p "Wähle eine Option (1-3): " choice

case $choice in
    1)
        MODE="thumbnails"
        echo "📱 Thumbnail-Modus gewählt"
        ;;
    2)
        MODE="optimize"
        echo "⚡ Optimierungs-Modus gewählt"
        ;;
    3)
        echo "👋 Auf Wiedersehen!"
        exit 0
        ;;
    *)
        echo "❌ Ungültige Auswahl!"
        exit 1
        ;;
esac

echo "----------------------------------------"

# Prüfe ob ImageMagick installiert ist
if command -v magick &> /dev/null; then
    echo "✅ ImageMagick gefunden - verwende ImageMagick"
    TOOL="imagemagick"
elif command -v sips &> /dev/null; then
    echo "✅ SIPS gefunden - verwende Apple SIPS"
    TOOL="sips"
else
    echo "❌ Weder ImageMagick noch SIPS gefunden!"
    echo "   Installiere ImageMagick mit: brew install imagemagick"
    exit 1
fi

# In den Zielordner wechseln
cd "$INPUT_DIR" || exit 1

# Für Thumbnail-Modus: Thumbnail-Ordner erstellen
if [ "$MODE" = "thumbnails" ]; then
    THUMBNAIL_DIR="thumbnails"
    if [ ! -d "$THUMBNAIL_DIR" ]; then
        mkdir -p "$THUMBNAIL_DIR"
        echo "📁 Thumbnail-Ordner erstellt: $THUMBNAIL_DIR"
    else
        echo "📁 Thumbnail-Ordner gefunden: $THUMBNAIL_DIR"
    fi
    echo "📏 Thumbnail-Größe: ${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE} Pixel"
fi

echo "🎯 Qualität: ${QUALITY}%"
echo "----------------------------------------"

# Zähler
processed=0
skipped=0
errors=0

# Alle Bilddateien verarbeiten
for file in *.{jpg,jpeg,JPG,JPEG,png,PNG,bmp,BMP,tiff,TIFF,webp,WEBP}; do
    # Prüfe ob Datei existiert
    [ ! -f "$file" ] && continue
    
    # Dateiname und Erweiterung extrahieren
    filename=$(basename "$file")
    extension="${filename##*.}"
    name="${filename%.*}"
    
    if [ "$MODE" = "thumbnails" ]; then
        # Thumbnail-Modus
        output_file="$THUMBNAIL_DIR/$filename"
        
        # Prüfe ob Thumbnail bereits existiert
        if [ -f "$output_file" ]; then
            echo "⏭️  Überspringe $filename (Thumbnail existiert bereits)"
            ((skipped++))
            continue
        fi
        
        echo "🔄 Erstelle Thumbnail: $filename -> thumbnails/$filename"
        
        # Thumbnail erstellen
        if [ "$TOOL" = "imagemagick" ]; then
            magick "$file" \
                -resize "${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE}^" \
                -gravity center \
                -extent "${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE}" \
                -quality "$QUALITY" \
                -strip \
                "$output_file"
        else
            sips -Z "$THUMBNAIL_SIZE" "$file" --out "$output_file" > /dev/null 2>&1
        fi
        
    else
        # Optimierungs-Modus
        temp_file="${name}_temp.${extension}"
        
        echo "🔄 Optimiere: $filename"
        
        # Bild optimieren
        if [ "$TOOL" = "imagemagick" ]; then
            magick "$file" \
                -quality "$QUALITY" \
                -strip \
                -interlace Plane \
                "$temp_file"
        else
            # SIPS kann nur begrenzt optimieren
            sips -s formatOptions high "$file" --out "$temp_file" > /dev/null 2>&1
        fi
        
        # Original durch optimierte Version ersetzen
        if [ -f "$temp_file" ]; then
            mv "$temp_file" "$file"
            output_file="$file"
        else
            output_file=""
        fi
    fi
    
    # Prüfe ob erfolgreich
    if [ -f "$output_file" ]; then
        # Dateigröße anzeigen
        original_size=$(stat -f%z "$file" 2>/dev/null || echo "0")
        new_size=$(stat -f%z "$output_file" 2>/dev/null || echo "0")
        
        if [ "$original_size" -gt 0 ] && [ "$new_size" -gt 0 ]; then
            # Berechne Größenreduktion
            reduction=$(( (original_size - new_size) * 100 / original_size ))
            if [ "$reduction" -gt 0 ]; then
                echo "✅ Erfolgreich: $filename (-${reduction}% Dateigröße)"
            else
                echo "✅ Erfolgreich: $filename"
            fi
        else
            echo "✅ Erfolgreich: $filename"
        fi
        ((processed++))
    else
        echo "❌ Fehler bei: $filename"
        ((errors++))
    fi
done

echo "----------------------------------------"
echo "🎉 Fertig!"
echo "📊 $processed Bilder verarbeitet"

if [ $skipped -gt 0 ]; then
    echo "⏭️  $skipped Bilder übersprungen"
fi

if [ $errors -gt 0 ]; then
    echo "❌ $errors Fehler aufgetreten"
fi

# Zusammenfassung anzeigen
if [ $processed -gt 0 ]; then
    echo ""
    if [ "$MODE" = "thumbnails" ]; then
        echo "📁 Thumbnails erstellt in: $THUMBNAIL_DIR/"
        echo "📊 Beispiel-Thumbnails:"
        ls -lah "$THUMBNAIL_DIR"/*.{jpg,jpeg,png} 2>/dev/null | head -3
    else
        echo "⚡ Bilder optimiert im aktuellen Ordner"
        echo "📊 Optimierte Dateien:"
        ls -lah *.{jpg,jpeg,png} 2>/dev/null | head -3
    fi
    
    echo ""
    echo "💡 Tipp: Du kannst das Script erneut ausführen, um weitere Optionen zu nutzen!"
fi