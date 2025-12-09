package com.margelo.nitro.gradient

import android.content.Context
import android.util.Log
import android.view.View
import androidx.annotation.Keep
import com.facebook.common.internal.DoNotStrip
import kotlin.collections.contentEquals
import kotlin.toString

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
                    angle?.let { gradientDrawable.setPointsFromAngle(it, w, h) }
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
                gradientDrawable.invalidate()
            }
        }

    override var positions: DoubleArray? = null
        set(value) {
            if (!field.contentEquals(value)) {
                field = value
                gradientDrawable.setPositions(value?.map { it.toFloat() }?.toFloatArray())
                gradientDrawable.invalidate()
            }
        }

    override var angle: Double? = null
        set(value){
            Log.d("the angle value", value.toString());
            if(field != value){
                field = value;
                val w = gradientView.width
                val h = gradientView.height
                if (w > 0 && h > 0) {
                    angle?.let { gradientDrawable.setPointsFromAngle(it, w, h) }
                    gradientDrawable.invalidate()
                }
            }
        }

    override var start: Vector? = null
        set(value) {
            Log.d("the start value", angle.toString());
            if(this.angle != null){
                return
            }

            if (field != value) {
                field = value

                val w = gradientView.width
                val h = gradientView.height
                if (w > 0 && h > 0 && value != null) {
                    gradientDrawable.setStart(value, w, h, density)
                    gradientDrawable.invalidate()
                }
            }
        }

    override var end: Vector? = null
        set(value) {
            Log.d("the end value", angle.toString());
            if(this.angle != null){
                return;
            }

            if (field != value) {
                field = value

                val w = gradientView.width
                val h = gradientView.height
                if (w > 0 && h > 0 && value != null) {
                    gradientDrawable.setEnd(value, w, h, density)
                    gradientDrawable.invalidate()
                }
            }
        }

    override fun update(
        colors: Variant_NullType_DoubleArray?,
        positions: DoubleArray?,
        start: Vector?,
        end: Vector?,
        angle: Double?
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

        angle?.let {
            Log.d("the fachi", angle.toString());
            if(this.angle != it){
                this.angle = angle
                changed = true
            }
        }

        positions?.let {
            if (!this.positions.contentEquals(it)) {
                this.positions = it
                changed = true
            }
        }

        if(this.angle == null){
            Log.d("the sachi", angle.toString());
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
        }

        if (changed) {
            gradientDrawable.invalidate()
        }
    }
}
