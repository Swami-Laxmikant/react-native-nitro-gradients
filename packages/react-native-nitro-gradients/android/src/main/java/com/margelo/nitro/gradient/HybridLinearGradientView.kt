package com.margelo.nitro.gradient

import android.content.Context
import android.view.View
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip

@DoNotStrip
@Keep
class HybridLinearGradientView(context: Context): HybridLinearGradientViewSpec() {
    private val gradientDrawable = LinearGradientDrawable()
    private val gradientView = View(context)
    override val view: View = gradientView
    private val density = context.resources.displayMetrics.density
    private var isLayoutValid = false

    init {
        gradientView.background = gradientDrawable
        gradientView.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            val w = gradientView.width
            val h = gradientView.height
            if (w > 0 && h > 0) {
                if (!isLayoutValid) {
                    isLayoutValid = true
                    start?.let { gradientDrawable.setStart(it, w, h, density) }
                    end?.let { gradientDrawable.setEnd(it, w, h, density) }
                    gradientDrawable.invalidate()
                }
            }
        }
    }

    override var colors: DoubleArray = doubleArrayOf()
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setColors(value)
            }
        }

    override var positions: DoubleArray? = null
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setPositions(value?.map { it.toFloat() }?.toFloatArray())
            }
        }

    override var start: VectorR? = null
        set(value) {
            if (field != value) {
                field = value
                val w = gradientView.width
                val h = gradientView.height
                if (w > 0 && h > 0 && value != null) {
                    gradientDrawable.setStart(value, w, h, density)
                }
            }
        }

    override var end: VectorR? = null
        set(value) {
            if (field != value) {
                field = value
                val w = gradientView.width
                val h = gradientView.height
                if (w > 0 && h > 0 && value != null) {
                    gradientDrawable.setEnd(value, w, h, density)
                }
            }
        }

    override fun update(
        colors: Variant_NullType_DoubleArray?,
        positions: DoubleArray?,
        start: VectorR?,
        end: VectorR?
    ) {
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

        positions?.let {
            if (!this.positions.contentEquals(it)) {
                this.positions = it
                changed = true
            }
        }

        start?.let {
            if (this.start != it) {
                this.start = it
                changed = true
            }
        }

        end?.let {
            if (this.end != it) {
                this.end = it
                changed = true
            }
        }

        if (changed) {
            gradientDrawable.invalidate()
        }
    }
}
