import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

enum IconType {
    Default = "Default",
    Custom = "Custom",
}

enum SrcType {
    Upload = "Upload",
    URL = "URL",
}

// Check for the Search Index Meta Tag
// Currently the only way to differenciate between Preview & Publish
const metaTagSelector = 'meta[name="framer-search-index"]'

// We can hopefully remove this check when new Preview ships
function isPublishedSiteOrSSG() {
    if (typeof document === "undefined") return true
    const metaTag = document.querySelector(metaTagSelector)
    return !!metaTag
}

/**
 *
 * DOWNLOAD
 * By Hunter
 *
 * @framerIntrinsicWidth 200
 * @framerIntrinsicHeight 100
 *
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Download(props) {
    const { styleOptions, hoverOptions, iconOptions } = props

    const {
        backgroundColor,
        color,
        borderRadius,
        padding,
        paddingPerSide,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        gap,
    } = styleOptions

    const isInPublishedSiteOrSSG = isPublishedSiteOrSSG()

    let downloadURL = undefined
    if (isInPublishedSiteOrSSG) {
        if (props.srcType === SrcType.URL) downloadURL = props.srcURL
        if (props.srcType === SrcType.Upload) downloadURL = props.srcFile
    }

    const paddingValue = paddingPerSide
        ? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
        : `${padding}px`

    const getIcon = () => {
        if (!iconOptions) return

        const iconStyle = {
            order: iconOptions.alignment === "start" ? 0 : 2,
            flexShrink: 0,
        }

        return iconOptions.type === IconType.Custom &&
            !!iconOptions.image?.src ? (
            <img
                style={iconStyle}
                alt={
                    iconOptions.image?.alt && iconOptions.image.alt.length > 0
                        ? iconOptions.image.alt
                        : "download icon"
                }
                src={iconOptions.image.src}
                width={iconOptions.size}
                height={iconOptions.size}
            />
        ) : (
            <svg
                style={iconStyle}
                xmlns="http://www.w3.org/2000/svg"
                width={iconOptions.size}
                height={iconOptions.size}
                fill={iconOptions.color}
                viewBox="0 0 256 256"
            >
                <path d="M228 152v56a20 20 0 0 1-20 20H48a20 20 0 0 1-20-20v-56a12 12 0 0 1 24 0v52h152v-52a12 12 0 0 1 24 0Zm-108.49 8.49a12 12 0 0 0 17 0l40-40a12 12 0 0 0-17-17L140 123V40a12 12 0 0 0-24 0v83l-19.51-19.49a12 12 0 0 0-17 17Z" />
            </svg>
        )
    }

    const getCursor = () => {
        if (props.srcType === SrcType.URL && props.srcURL) return "pointer"
        if (props.srcType === SrcType.Upload && props.srcFile) return "pointer"
        return "auto"
    }

    const buttonTitle = isInPublishedSiteOrSSG
        ? "Download File"
        : "Publish to Download"

    return (
        <motion.a
            target="_blank"
            href={downloadURL}
            download
            title={buttonTitle}
            style={{
                gap,
                fontSize: 16,
                lineHeight: 1,
                fontFamily: "Inter",
                fontWeight: 500,
                width: "max-content",
                ...props.style,
                ...buttonStyles,
                ...props.fontControl,
                padding: paddingValue,
                color: color,
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                userSelect: "none",
                placeContent: flexAlignSwitch(props.fontControl),
                whiteSpace: "nowrap",
                cursor: getCursor(),
            }}
            whileHover={hoverOptions}
            transition={hoverOptions?.transition}
        >
            {getIcon()}
            {props.text}
        </motion.a>
    )
}

Download.displayName = "Download"

addPropertyControls(Download, {
    text: {
        title: "Text",
        type: ControlType.String,
        defaultValue: "Download",
    },
    srcType: {
        type: ControlType.Enum,
        displaySegmentedControl: true,
        title: "Source",
        options: [SrcType.Upload, SrcType.URL],
    },
    srcURL: {
        type: ControlType.String,
        title: " ",
        placeholder: "../example.pdf",
        hidden: (props) => props.srcType === SrcType.Upload,
    },
    srcFile: {
        type: ControlType.File,
        title: " ",
        allowedFileTypes: [],
        hidden: (props) => props.srcType === SrcType.URL,
    },
    fontControl: {
        // @ts-ignore - Internal
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
    },
    iconOptions: {
        type: ControlType.Object,
        optional: true,
        title: "Icon",
        buttonTitle: "Size, Color",
        controls: {
            type: {
                title: "Type",
                type: ControlType.Enum,
                options: Object.values(IconType),
                optionTitles: Object.values(IconType),
                displaySegmentedControl: true,
            },
            color: {
                title: "Color",
                type: ControlType.Color,
                defaultValue: "#FFF",
                hidden: (props) => props.type === IconType.Custom,
            },
            image: {
                title: "File",
                type: ControlType.ResponsiveImage,
                allowedFileTypes: ["jpg", "png", "svg"],
                hidden: (props) => props.type === IconType.Default,
            },
            size: {
                type: ControlType.Number,
                displayStepper: true,
                min: 5,
                defaultValue: 16,
                max: 250,
            },
            alignment: {
                title: "Align",
                type: ControlType.Enum,
                displaySegmentedControl: true,
                options: ["start", "end"],
                optionTitles: ["Start", "End"],
            },
        },
    },
    styleOptions: {
        type: ControlType.Object,
        title: "Styles",
        buttonTitle: "Button, Font",
        controls: {
            backgroundColor: {
                type: ControlType.Color,
                title: "Fill",
                defaultValue: "#111",
            },
            color: { type: ControlType.Color, defaultValue: "#FFF" },
            borderRadius: {
                type: ControlType.Number,
                title: "Radius",
                displayStepper: true,
                defaultValue: 50,
            },
            padding: {
                title: "Padding",
                type: ControlType.FusedNumber,
                toggleKey: "paddingPerSide",
                toggleTitles: ["Padding", "Padding per side"],
                defaultValue: 10,
                valueKeys: [
                    "paddingTop",
                    "paddingRight",
                    "paddingBottom",
                    "paddingLeft",
                ],
                valueLabels: ["T", "R", "B", "L"],
                min: 0,
            },
            gap: {
                title: "Gap",
                type: ControlType.Number,
                displayStepper: true,
                defaultValue: 5,
            },
        },
    },
    hoverOptions: {
        type: ControlType.Object,
        title: "Hover",
        buttonTitle: "Effect",
        optional: true,
        controls: {
            scale: {
                type: ControlType.Number,
                title: "Scale",
                min: 0,
                max: 10,
                displayStepper: true,
                step: 0.01,
                defaultValue: 1.1,
            },
            backgroundColor: {
                type: ControlType.Color,
                title: "Fill",
                defaultValue: "#333",
                optional: true,
            },
            color: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "#FFF",
                optional: true,
            },
            transition: {
                type: ControlType.Transition,
                title: "Transition",
                defaultValue: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                },
            },
        },
    },
})

const buttonStyles = {
    display: "flex",
    placeItems: "center",
    placeContent: "center",
    textDecoration: "none",
}

/* Match flex content alignment with text align */
const flexAlignSwitch = (fontControlStyles) => {
    if (!fontControlStyles?.textAlign) {
        return "left"
    }
    if (fontControlStyles.textAlign === "left") {
        return "flex-start"
    }

    if (fontControlStyles.textAlign === "right") {
        return "flex-end"
    }

    return "center"
}
