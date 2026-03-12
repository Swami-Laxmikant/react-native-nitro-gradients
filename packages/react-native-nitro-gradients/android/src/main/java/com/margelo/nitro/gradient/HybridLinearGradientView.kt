package com.margelo.nitro.gradient

import android.content.Context
import android.view.View
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import kotlin.collections.contentEquals

@DoNotStrip
@Keep
class HybridLinearGradientView(context: Context): HybridLinearGradientViewSpec() {
    private val gradientDrawable = LinearGradientDrawable()
    private val gradientView = View(context)
    override val view: View = gradientView
    private val density = context.resources.displayMetrics.density
    private val defaultStart = Vector(
        x = Variant_String_Double.First("50%"),
        y = Variant_String_Double.First("0%")
    )
    private val defaultEnd = Vector(
        x = Variant_String_Double.First("50%"),
        y = Variant_String_Double.First("100%")
    )
    private var isLayoutValid = false
    private var updateDepth = 0
    private var hasPendingInvalidate = false

    private fun invalidateGradient() {
        if (updateDepth > 0) {
            hasPendingInvalidate = true
        } else {
            gradientDrawable.invalidate()
        }
    }

    override fun beforeUpdate() {
        updateDepth += 1
    }

    override fun afterUpdate() {
        if (updateDepth == 0) {
            return
        }

        updateDepth -= 1
        if (updateDepth == 0 && hasPendingInvalidate) {
            hasPendingInvalidate = false
            gradientDrawable.invalidate()
        }
    }

    private fun updateLinePoints() {
        val w = gradientView.width
        val h = gradientView.height
        if (w <= 0 || h <= 0) {
            return
        }

        val currentAngle = angle
        if (currentAngle != null) {
            gradientDrawable.setPointsFromAngle(currentAngle, w, h)
            return
        }

        gradientDrawable.setStart(start ?: defaultStart, w, h, density)
        gradientDrawable.setEnd(end ?: defaultEnd, w, h, density)
    }

    init {
        gradientView.background = gradientDrawable
        gradientView.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            val w = gradientView.width
            val h = gradientView.height
            if (w > 0 && h > 0) {
                if (!isLayoutValid) {
                    isLayoutValid = true
                    updateLinePoints()
                    invalidateGradient()
                }
            }
        }
    }

    override var blur: Double? = null
        set(value) {
            if (field != value) {
                field = value
                applyBlurToView(
                    gradientView,
                    value,
                    tileMode,
                    gradientDrawable::setBlur,
                    ::invalidateGradient
                )
            }
        }

    override var tileMode: String? = null
        set(value) {
            if (field != value) {
                field = value
                gradientDrawable.setTileMode(value.toTileMode())
                applyBlurToView(
                    gradientView,
                    blur,
                    value,
                    gradientDrawable::setBlur,
                    ::invalidateGradient
                )
            }
        }

    override var colors: DoubleArray = doubleArrayOf()
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setColors(value)
                invalidateGradient()
            }
        }

    override var positions: DoubleArray? = null
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setPositions(value?.map { it.toFloat() }?.toFloatArray())
                invalidateGradient()
            }
        }

    override var angle: Double? = null
        set(value){
            if (field != value) {
                field = value
                if (gradientView.width > 0 && gradientView.height > 0) {
                    updateLinePoints()
                    invalidateGradient()
                }
            }
        }

    override var start: Vector? = null
        set(value) {
            if (field != value) {
                field = value
                if (angle == null && gradientView.width > 0 && gradientView.height > 0) {
                    updateLinePoints()
                    invalidateGradient()
                }
            }
        }

    override var end: Vector? = null
        set(value) {
            if (field != value) {
                field = value
                if (angle == null && gradientView.width > 0 && gradientView.height > 0) {
                    updateLinePoints()
                    invalidateGradient()
                }
            }
        }

    override fun update(
        colors: Variant_NullType_DoubleArray?,
        positions: DoubleArray?,
        start: Vector?,
        end: Vector?,
        angle: Double?,
        blur: Double?,
        tileMode: String?
    ) {
        beforeUpdate()
        try {
            var changed = false

            when (val colorsArg = colors.asOptionalDoubleArray()) {
                is OptionalVariant.Provided -> {
                    val nextColors = colorsArg.value ?: doubleArrayOf()
                    if (!this.colors.contentEquals(nextColors)) {
                        this.colors = nextColors
                        changed = true
                    }
                }
                OptionalVariant.NotProvided -> Unit
            }

            if (!this.positions.contentEquals(positions)) {
                this.positions = positions
                changed = true
            }

            if (this.angle != angle) {
                this.angle = angle
                changed = true
            }

            if (this.start != start) {
                this.start = start
                if (this.angle == null) {
                    changed = true
                }
            }

            if (this.end != end) {
                this.end = end
                if (this.angle == null) {
                    changed = true
                }
            }

            if (this.blur != blur) {
                this.blur = blur
            }

            if (this.tileMode != tileMode) {
                this.tileMode = tileMode
            }

            if (changed) {
                invalidateGradient()
            }
        } finally {
            afterUpdate()
        }
    }
}
