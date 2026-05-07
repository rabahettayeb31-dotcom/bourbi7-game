import flet as ft
import random
import json
import os
from datetime import datetime

# ============================================================================
# الألوان
# ============================================================================

COLORS = {
    "bg_dark": "#0a0a1a",
    "bg_card": "#1a1a2e",
    "bg_light": "#22223b",
    "text_white": "#f8f9fa",
    "text_sub": "#adb5bd",
    "text_dim": "#6c757d",
    "accent": "#e94560",
    "success": "#06d6a0",
    "warning": "#ffd93d",
    "danger": "#ef476f",
    "purple": "#7209b7",
    "cyan": "#00b4d8",
    "orange": "#f39c12",
}

CATEGORY_COLORS = {
    "friends": {"main": "#f39c12", "emoji": "👬", "label": "الصحاب"},
    "family": {"main": "#2ecc71", "emoji": "👨‍👩‍👧‍👦", "label": "العايلة"},
    "couples": {"main": "#e84393", "emoji": "💑", "label": "الكوبل"},
    "lovers": {"main": "#9b59b6", "emoji": "💕", "label": "الحبايب"},
    "work": {"main": "#3498db", "emoji": "💼", "label": "العمل"},
    "plus18": {"main": "#e74c3c", "emoji": "🔞", "label": "+18"},
}

CATEGORY_ORDER = ["friends", "family", "couples", "lovers", "work", "plus18"]

# ============================================================================
# العقوبات والتحديات (50 تحدي)
# ============================================================================

CHALLENGES = [
    "😂 اضحك بصوت عالي 10 ثواني",
    "💃 ارقص 5 ثواني",
    "🎤 غني مقطع من أغنية مشهورة",
    "🥤 اشرب كاس ماء بارد دفعة وحدة",
    "📞 كلم واحد من الصحاب وقلو أنا نحبك",
    "😂 حك نكتة خايب",
    "🧹 اغسل الماعون يا معلم",
    "🐶 عوط كي الكلب",
    "🦁 زمجّر كي الأسد",
    "💪 وري عضلاتك وقل أنا كبير",
    "🎭 قلد واحد من الجالسين",
    "📸 صور روحك وحدث عليها",
    "🤝 صافح الكل وقلهم شكراً",
    "😡 صيح 'يا لطيف' 3 مرات",
    "🕺 تحرك كي الدودة",
    "🍕 تخيل أنك تاكل بيتزا أمام الكل",
    "😴 تغطّي كي باش ترقد",
    "🤔 اتخذ منصب باش تفكّر في سؤالك",
    "🎬 مثل مشهد من مسلسل تركي",
    "🗣️ حك قصة مضحكة من طفولتك",
    "👑 تولي ملك/ملكة لمدة دقيقة",
    "🎤 سوّي مقابلة مع نفسك",
    "📢 صيح 'أنا مشهور' 3 مرات",
    "💃 ارقص رقصة الفرح التونسية",
    "🍚 كل ملعقة رز وأنت مغمض",
    "🥛 اشرب لبن وأنت تقول يا لطيف",
    "🔊 سمعني صوتك أعلى ما عندك",
    "🎭 قلد صوت حيوان من اختيار الجماعة",
    "🤡 حط إصبعك في أنفك وثبت",
    "😈 غمز لشخص في الغرفة",
    "💋 بعت قبلة هوائية لأقرب شخص",
    "🔥 قول كلمة جريئة بصوت عالي",
    "😏 سوّي حركة مثيرة",
    "💕 عبر عن حبك لشخص بطريقة مضحكة",
    "🌹 قدم وردة وهمية لشخص",
    "💌 اكتب رسالة حب على ورق واقرأها",
    "😳 احكي عن أول كرشة في حياتك",
    "💪 قول 'أنا الأقوى' بصوت عالي",
    "🕺 ارقص رقصة مثيرة 5 ثواني",
    "🎭 مثل مشهد من فيلم رومنسي",
    "☕ جيب القهوة للكل",
    "🍪 وزع حلويات على الجماعة",
    "💆 دلك كتاف الشخص اللي جمبك",
    "🚪 افتح الباب لكل واحد يخرج",
    "🎁 قدم هدية رمزية لشخص",
    "🖼️ صور الجماعة كلها",
    "🎲 ارمي الزهر وخمّن الرقم",
    "💰 راهن على نفسك بنقطة",
    "⭐ قول 3 أشياء تحبها في روحك",
    "🤖 تحرك كي الروبوت 10 ثواني",
    "🦖 مشي كي الديناصور",
]

# ============================================================================
# الأسئلة (100 سؤال تقريباً لضيق المساحة)
# ============================================================================

QUESTIONS = {
    "friends": [
        "شكون أكثر واحد يڨول 'أنا جاي' وهو مازال في الدار؟ 😂",
        "شكون أكثر واحد يصرف فلوسو في القهوة؟ ☕",
        "شكون أكثر واحد يبعث vocal طويلة؟ 🎤",
        "شكون أكثر واحد يعمل seen وما يجاوبش؟ 👀",
        "شكون أكثر واحد يضحك وحدو؟ 😅",
        "شكون أكثر واحد يخاف من أمو؟ 😂",
        "شكون أكثر واحد يحب التصاور؟ 📸",
        "شكون أكثر واحد يهرب كي يجي وقت الخلاص؟ 💸",
        "شكون أكثر واحد يحب يعمل دراما؟ 🎭",
        "شكون أكثر واحد ينسى تلفونو؟ 📱",
        "شكون أكثر واحد ينعس في القهوة؟ 😴",
        "شكون أكثر واحد يحب يڨعد online بالليل؟ 🌙",
        "شكون أكثر واحد يتغشش بسرعة؟ 😤",
        "شكون أكثر واحد يحب يقلق الناس؟ 😂",
        "شكون أكثر واحد يعمل crush بسرعة؟ ❤️",
        "شكون أكثر واحد يكذب كي يتأخر؟ 🤥",
        "شكون أكثر واحد يحب الماكلة؟ 🍕",
        "شكون أكثر واحد يبدل رأيو؟ 🔄",
        "شكون أكثر واحد يخسر في الألعاب؟ 🎮",
        "شكون أكثر واحد يحب المقالب؟ 😈",
        "شكون أكثر واحد ينسى anniversaires؟ 🎂",
        "شكون أكثر واحد يحب السهر؟ 🌙",
        "شكون أكثر واحد يحب gossip؟ 🤫",
        "شكون أكثر واحد يطلب attention؟ 🙋",
        "شكون أكثر واحد عندو ضحكة غريبة؟ 😂",
        "شكون أكثر واحد يحب الكورة؟ ⚽",
        "شكون أكثر واحد يبعث memes؟ 😅",
        "شكون أكثر واحد يسرق البطاطا من صحن صحابو؟ 🍟",
        "شكون أكثر واحد يحب يبان cool؟ 😎",
        "شكون أكثر واحد يطيح في مواقف محرجة؟ 😳",
        "شكون أكثر واحد يضيع مفاتيحو؟ 🔑",
        "شكون أكثر واحد يقول 'آخر مرة' ويرجع يعاود؟ 😂",
        "شكون أكثر واحد يعمل stalking؟ 👀",
        "شكون أكثر واحد يحب الموسيقى بصوت عالي؟ 🎵",
        "شكون أكثر واحد يتفرهد بسرعة؟ 😤",
        "شكون أكثر واحد يحب يجاوب على بلاصة الناس؟ 🗣️",
        "شكون أكثر واحد يعمل screen للmessages؟ 😅",
        "شكون أكثر واحد يحب يضحك على صحابو؟ 😂",
        "شكون أكثر واحد ما ينجمش يسكت؟ 🗣️",
        "شكون أكثر واحد يحب يركب problème؟ 😂",
        "شكون أكثر واحد يطلب wifi أول ما يدخل؟ 📶",
        "شكون أكثر واحد يحب يڨعد وحدو؟ 🙈",
        "شكون أكثر واحد يخاف من الحب؟ ❤️",
        "شكون أكثر واحد يعمل jalousie؟ 😒",
        "شكون أكثر واحد يبعث emojis أكثر من الكلام؟ 😂",
        "شكون أكثر واحد يعمل excuses؟ 🙃",
        "شكون أكثر واحد يحب يعمل live؟ 📱",
        "شكون أكثر واحد يحب يتفلسف؟ 🧠",
        "شكون أكثر واحد يعمل panic بسرعة؟ 😅",
        "شكون أكثر واحد لو يختفي نهار، الجماعة ترتاح؟ 😂",
    ],
    "family": [
        "شكون أكثر واحد ياكل في الدار؟ 🍲",
        "شكون أكثر واحد يسرق من الثلاجة بالليل؟ 😂",
        "شكون أكثر واحد يشد الريموت؟ 📺",
        "شكون أكثر واحد يرقد بعد الغدا؟ 😴",
        "شكون أكثر واحد يعمل مشاكل في رمضان؟ 🌙",
        "شكون أكثر واحد ينسى يشري الخبز؟ 🥖",
        "شكون أكثر واحد يحب الأعراس؟ 💃",
        "شكون أكثر واحد يفيق بكري؟ ☀️",
        "شكون أكثر واحد يتغشش في الكوجينة؟ 🍳",
        "شكون أكثر واحد يحب القهوة؟ ☕",
        "شكون أكثر واحد يضيع حوايجو؟ 🔍",
        "شكون أكثر واحد يحب يخرج؟ 🚪",
        "شكون أكثر واحد يحب الرقاد؟ 😴",
        "شكون أكثر واحد يحب يحكم في الناس؟ 😂",
        "شكون أكثر واحد يعمل noise في الدار؟ 📣",
        "شكون أكثر واحد يحب المسلسلات التركية؟ 📺",
        "شكون أكثر واحد ينسى المناسبات؟ 🎂",
        "شكون أكثر واحد يحب الحلويات؟ 🍰",
        "شكون أكثر واحد يعمل drama؟ 🎭",
        "شكون أكثر واحد يحب يڨعد وحدو؟ 🙈",
        "شكون أكثر واحد يخاف على الفلوس؟ 💸",
        "شكون أكثر واحد يحب السوق؟ 🛒",
        "شكون أكثر واحد يحب يضحك الناس؟ 😂",
        "شكون أكثر واحد ينسى غلق الضوء؟ 💡",
        "شكون أكثر واحد يحب الكسكسي؟ 🍲",
        "شكون أكثر واحد يفيق الناس من النوم؟ 😂",
        "شكون أكثر واحد يحب العيد؟ 🎉",
        "شكون أكثر واحد يكثر أسئلة؟ 🤔",
        "شكون أكثر واحد يحب gossip العائلة؟ 😅",
        "شكون أكثر واحد يهرب من التنظيف؟ 🧹",
        "شكون أكثر واحد يحب النوم قدام التلفزة؟ 📺",
        "شكون أكثر واحد يحب يحكي في الهاتف؟ 📞",
        "شكون أكثر واحد يعمل panic؟ 😅",
        "شكون أكثر واحد يحب الضيوف؟ 🏠",
        "شكون أكثر واحد ينسى مفاتيحو؟ 🔑",
        "شكون أكثر واحد يحب يطبخ؟ 👨‍🍳",
        "شكون أكثر واحد يحب يعمل surprise؟ 🎁",
        "شكون أكثر واحد يحب يڨعد في الدار؟ 🏠",
        "شكون أكثر واحد يحب يضحك بصوت عالي؟ 😂",
        "شكون أكثر واحد يعمل chaos في الدار؟ 🌀",
        "شكون أكثر واحد يحب الشكشوكة؟ 🍳",
        "شكون أكثر واحد يفيق متأخر؟ ⏰",
        "شكون أكثر واحد يخاف من أمو؟ 😅",
        "شكون أكثر واحد يحب التصاور العائلية؟ 📸",
        "شكون أكثر واحد يحب يسهر؟ 🌙",
        "شكون أكثر واحد يعمل excuses؟ 🙃",
        "شكون أكثر واحد يحب الموسيقى؟ 🎵",
        "شكون أكثر واحد يحب البحر؟ 🌊",
        "شكون أكثر واحد يحب يتفرج في TikTok؟ 📱",
        "شكون أكثر واحد يحكم الدار بصمت؟ 😂",
    ],
    "couples": [
        "شكون أكثر واحد يغير؟ 😏",
        "شكون أكثر واحد يقول 'وينك؟' كل شوي؟ 📱",
        "شكون أكثر واحد يعمل بلوك ويرجع يفك؟ 😂",
        "شكون أكثر واحد يحب التصاور couple؟ 📸",
        "شكون أكثر واحد يطلب attention؟ ❤️",
        "شكون أكثر واحد يحب الرومنسية؟ 🌹",
        "شكون أكثر واحد يتغشش بسرعة؟ 😤",
        "شكون أكثر واحد يراقب last seen؟ 👀",
        "شكون أكثر واحد يحب السهر في المكالمات؟ 🌙",
        "شكون أكثر واحد يحب الدلع؟ 🥺",
        "شكون أكثر واحد ينسى المناسبات؟ 😅",
        "شكون أكثر واحد يحب surprises؟ 🎁",
        "شكون أكثر واحد يعمل jalousie بصمت؟ 😒",
        "شكون أكثر واحد يبعث emojis؟ 😂",
        "شكون أكثر واحد يحب النوم؟ 😴",
        "شكون أكثر واحد يحب الهدوء؟ 🕊️",
        "شكون أكثر واحد يحب الڨعدة في القهوة؟ ☕",
        "شكون أكثر واحد يقول 'برا نرقد' ويبقى online؟ 😂",
        "شكون أكثر واحد يحب التصاور؟ 📸",
        "شكون أكثر واحد يحب يهزر؟ 😄",
        "شكون أكثر واحد يعمل stalking؟ 👀",
        "شكون أكثر واحد يطلب excuses؟ 🙃",
        "شكون أكثر واحد يحب الهدايا؟ 🎁",
        "شكون أكثر واحد يحب يبان romantique؟ ❤️",
        "شكون أكثر واحد يبعث messages طويلة؟ 📝",
        "شكون أكثر واحد يحب الattention الزايدة؟ 🙋",
        "شكون أكثر واحد يغار من الصحاب؟ 😒",
        "شكون أكثر واحد يعمل drama؟ 😂",
        "شكون أكثر واحد يحب يحكي؟ 🗣️",
        "شكون أكثر واحد يحب يخرج؟ 🚗",
        "شكون أكثر واحد يعتذر أول؟ 🙏",
        "شكون أكثر واحد يحب surprise dates؟ 💑",
        "شكون أكثر واحد يحب التصاور السرية؟ 😅",
        "شكون أكثر واحد يحب يڨعد قريب؟ 🤝",
        "شكون أكثر واحد يعمل crush على ممثل؟ 😂",
        "شكون أكثر واحد يبعث reels؟ 📱",
        "شكون أكثر واحد يطلب confirmation للحب؟ ❤️",
        "شكون أكثر واحد يخاف من الفراق؟ 😢",
        "شكون أكثر واحد يحب الهدية البسيطة؟ 🌸",
        "شكون أكثر واحد يحب البحر والرومنسية؟ 🌊",
        "شكون أكثر واحد يحب يسمع compliments؟ 😊",
        "شكون أكثر واحد يعمل panic إذا ما جاوبش الثاني؟ 😅",
        "شكون أكثر واحد يحب selfies؟ 📸",
        "شكون أكثر واحد يحب hugs؟ ❤️",
        "شكون أكثر واحد يغير من likes؟ 😂",
        "شكون أكثر واحد يحب المكالمات الطويلة؟ 📞",
        "شكون أكثر واحد يحب الحنان؟ 🥰",
        "شكون أكثر واحد يحب المفاجآت الجريئة؟ 😏",
        "شكون أكثر واحد يعمل silence drama؟ 😂",
        "شكون أكثر واحد إذا يختفي ساعة، الثاني يجن؟ ❤️",
    ],
    "lovers": [
        "شكون أكثر واحد يعمل flirting؟ 😏",
        "شكون أكثر واحد يعمل stalking في Instagram؟ 👀",
        "شكون أكثر واحد يبعث messages في الليل؟ 🌙",
        "شكون أكثر واحد يحب الكلام الجريء؟ 😂",
        "شكون أكثر واحد يعمل crush بسرعة؟ ❤️",
        "شكون أكثر واحد يحب attention زايدة؟ 🙋",
        "شكون أكثر واحد يمثل البراءة؟ 😅",
        "شكون أكثر واحد يحب compliments؟ 😊",
        "شكون أكثر واحد يعمل jalousie؟ 😒",
        "شكون أكثر واحد يحب selfies جريئة؟ 📸",
        "شكون أكثر واحد يحب flirting بالعيون؟ 👀",
        "شكون أكثر واحد يبعث emojis مريبة؟ 😂",
        "شكون أكثر واحد يحب العلاقات السرية؟ 😏",
        "شكون أكثر واحد يحب romantic messages؟ ❤️",
        "شكون أكثر واحد يبعث 'نموت عليك' بسرعة؟ 😂",
        "شكون أكثر واحد يحب الحب السريع؟ ⚡",
        "شكون أكثر واحد يعمل seen ويرجع يجاوب بعد ساعات؟ 😅",
        "شكون أكثر واحد يحب السهر مع crush؟ 🌙",
        "شكون أكثر واحد يطيح في الحب بسهولة؟ ❤️",
        "شكون أكثر واحد يعمل drama حب؟ 🎭",
        "شكون أكثر واحد يحب hugs؟ 🤗",
        "شكون أكثر واحد يحب kisses؟ 😘",
        "شكون أكثر واحد يبعث reels رومنسية؟ 📱",
        "شكون أكثر واحد يغار بصمت؟ 😒",
        "شكون أكثر واحد يحب التلميحات؟ 😏",
        "شكون أكثر واحد يعمل stories باش يغيظ شخص؟ 😂",
        "شكون أكثر واحد يحب الدلع؟ 🥺",
        "شكون أكثر واحد يحب العلاقات الطويلة؟ 💑",
        "شكون أكثر واحد يحب يراقب online؟ 👀",
        "شكون أكثر واحد يحب المكالمات الليلية؟ 🌙",
        "شكون أكثر واحد يحب الكلام الرومانسي؟ ❤️",
        "شكون أكثر واحد يحب الغموض؟ 🔮",
        "شكون أكثر واحد يبعث صور أكثر؟ 📸",
        "شكون أكثر واحد يحب attention قبل النوم؟ 😅",
        "شكون أكثر واحد يحب الحب من أول نظرة؟ 👁️",
        "شكون أكثر واحد يعمل panic إذا ما جاوبش crush؟ 😂",
        "شكون أكثر واحد يحب jealousy games؟ 😏",
        "شكون أكثر واحد يبعث 'وينك؟' كل شوي؟ 📱",
        "شكون أكثر واحد يحب compliments على الشكل؟ 😊",
        "شكون أكثر واحد يعمل flirting في القهوة؟ ☕",
        "شكون أكثر واحد يحب الtouching اللطيف؟ ❤️",
        "شكون أكثر واحد يحب المفاجآت الرومنسية؟ 🎁",
        "شكون أكثر واحد يبعث قلب بسرعة؟ ❤️",
        "شكون أكثر واحد يحب التلميحات الجريئة؟ 😏",
        "شكون أكثر واحد يحب الحب المجنون؟ 😂",
        "شكون أكثر واحد يعمل crush على المشاهير؟ 🌟",
        "شكون أكثر واحد يحب الرومنسية في البحر؟ 🌊",
        "شكون أكثر واحد يحب الكلام الحلو أكثر من الهدايا؟ 💬",
        "شكون أكثر واحد يحب العلاقات complicated؟ 😅",
        "شكون أكثر واحد إذا يحب، يبان عليه فورًا؟ ❤️",
    ],
    "work": [
        "شكون أكثر واحد يتأخر كل نهار في الخدمة؟ ⏰",
        "شكون أكثر واحد يشرب قهوة أكثر من المطلوب؟ ☕",
        "شكون أكثر واحد يطلب أذن باش يخرج؟ 🚪",
        "شكون أكثر واحد يتغشش كي يجي الماناجير؟ 😏",
        "شكون أكثر واحد يحب يسرق الفوطور؟ 🖨️",
        "شكون أكثر واحد ينعس في الاجتماعات؟ 😴",
        "شكون أكثر واحد يكثر أسئلة في الاجتماع؟ 🤔",
        "شكون أكثر واحد ياكل في وقت الخدمة؟ 🍕",
        "شكون أكثر واحد يضيع وقت في التلفون؟ 📱",
        "شكون أكثر واحد يزيد في الوقت باش يخلص؟ ⏳",
        "شكون أكثر واحد يحب يخرج بكري؟ 🚗",
        "شكون أكثر واحد ياخذ برشا راحة؟ ☕",
        "شكون أكثر واحد يغش في التوقيت؟ 🕐",
        "شكون أكثر واحد يحب يتغذا برا؟ 🍽️",
        "شكون أكثر واحد يدخل الانترنات في الحاسوب؟ 💻",
        "شكون أكثر واحد يسمع الموسيقى في الخدمة؟ 🎵",
        "شكون أكثر واحد يكثر كلام على راسو؟ 🗣️",
        "شكون أكثر واحد يحب يبان كي يعمل؟ 😎",
        "شكون أكثر واحد يهرب من الشغل الثقيل؟ 🏃",
        "شكون أكثر واحد يطلب أوفريت؟ ⏰",
        "شكون أكثر واحد يعمل أمراض كي يحب يخرج؟ 🤒",
        "شكون أكثر واحد يكثر شكوى من الإدارة؟ 😤",
        "شكون أكثر واحد يسرق من المكتب؟ ✏️",
        "شكون أكثر واحد يحب يكذب في السي ڤي؟ 📄",
        "شكون أكثر واحد يضيع الحوايج في المكتب؟ 🔍",
        "شكون أكثر واحد يحب يحكي في التلفون برشا؟ 📞",
        "شكون أكثر واحد يخاف من الرتبة؟ 😨",
        "شكون أكثر واحد يحب الدورة؟ 🎓",
        "شكون أكثر واحد يتأخر من البريك؟ ☕",
        "شكون أكثر واحد يحب يجيب ماكلة للخدمة؟ 🍱",
        "شكون أكثر واحد يكثر كلام على الكل؟ 🗣️",
        "شكون أكثر واحد يحب يرتب المكتب؟ 📚",
        "شكون أكثر واحد يخبي على المشروعات؟ 📁",
        "شكون أكثر واحد يحب ياخذ كريدي لحوايجو؟ 🏆",
        "شكون أكثر واحد يطلب أوجمانتاسيون؟ 💰",
        "شكون أكثر واحد يحب القعدة في الكافطوريا؟ 🍽️",
        "شكون أكثر واحد يكثر من التصاور في الخدمة؟ 📸",
        "شكون أكثر واحد يعلق في المصعد؟ 🛗",
        "شكون أكثر واحد يخاف من التقييم؟ 📊",
        "شكون أكثر واحد يحب النقلات؟ 🚀",
        "شكون أكثر واحد ينسى الباسوورد؟ 🔑",
        "شكون أكثر واحد يحب الساعات الإضافية؟ ⏰",
        "شكون أكثر واحد يتعب بسرعة؟ 😩",
        "شكون أكثر واحد يحب يشتغل من الدار؟ 🏠",
        "شكون أكثر واحد يضيع ال meetings؟ 📅",
        "شكون أكثر واحد يحب التواصل مع الكل؟ 🤝",
        "شكون أكثر واحد يغش في العمل؟ 😏",
        "شكون أكثر واحد يحب الفريق متاعو؟ 👥",
        "شكون أكثر واحد يحب الراحة أكثر من الخدمة؟ 😴",
        "شكون أكثر واحد ينجح كان يحب؟ 🌟",
    ],
    "plus18": [
        "شكون أكثر واحد عنده خبرة في العلاقة؟ 🔥",
        "شكون أكثر واحد يبدا أول في المبادرة؟ 😈",
        "شكون أكثر واحد يحب الضو خافت؟ 🕯️",
        "شكون أكثر واحد يجيب أفكار جديدة في الفراش؟ 💡",
        "شكون أكثر واحد يعمل رومنسية قبل؟ ❤️‍🔥",
        "شكون أكثر واحد يطلب برشا في الليل؟ 🌙",
        "شكون أكثر واحد ما يخافش يجرب حوايج جديدة؟ 🎲",
        "شكون أكثر واحد يعرف يدير جو حار؟ 🔥",
        "شكون أكثر واحد يحب يطول في المقدمة؟ ⏳",
        "شكون أكثر واحد ما يحبش يخلص بسرعة؟ 🛑",
        "شكون أكثر واحد عنده طاقة أكثر في الليل؟ ⚡",
        "شكون أكثر واحد يعمل حركات تحرج الثاني؟ 😳",
        "شكون أكثر واحد يضحك في المواقف الحساسة؟ 😂",
        "شكون أكثر واحد يحب يتفرج قبل ما يعمل؟ 👀",
        "شكون أكثر واحد ينجم يقعد ساعات؟ ⏰",
        "شكون أكثر واحد يحب الكلام الجريء؟ 🗣️🔥",
        "شكون أكثر واحد يحب الإضاءة on؟ 💡",
        "شكون أكثر واحد يحب الإضاءة off؟ 🌑",
        "شكون أكثر واحد يعمل تمثيل في العلاقة؟ 🎭",
        "شكون أكثر واحد ينجم يخلي الثاني يطلب برشا؟ 🙏",
        "شكون أكثر واحد يحب المفاجآت الجريئة؟ 🎁🔥",
        "شكون أكثر واحد عنده موسيقى خاصة؟ 🎵",
        "شكون أكثر واحد يحب ياخذ وقته؟ 🐢",
        "شكون أكثر واحد يحب تكون بسرعة؟ 🐇",
        "شكون أكثر واحد يفضل الدلع قبل؟ 💆‍♀️",
        "شكون أكثر واحد يحب القبلات الطويلة؟ 💋",
        "شكون أكثر واحد عندو أماكن مفضلة في الدار؟ 🏠🔥",
        "شكون أكثر واحد يحب المغامرة خارج الدار؟ 🌳",
        "شكون أكثر واحد عنده خيال جريء؟ 🌟🔥",
        "شكون أكثر واحد يحب يكون مسموع؟ 🔊",
        "شكون أكثر واحد يحب يكون هادي؟ 🤫",
        "شكون أكثر واحد يبدل الأوضاع برشا؟ 🔄",
        "شكون أكثر واحد يحب يكون ثابت؟ 🗿",
        "شكون أكثر واحد ينجم يضحك ويواصل؟ 😂🔥",
        "شكون أكثر واحد يحب النظرات الطويلة؟ 👀❤️",
        "شكون أكثر واحد عنده لمسة سحرية؟ ✨",
        "شكون أكثر واحد يفضل الصباح؟ ☀️",
        "شكون أكثر واحد يفضل الليل؟ 🌙🔥",
        "شكون أكثر واحد يحب يكون الزعيم؟ 👑",
        "شكون أكثر واحد يفضل يكون التابع؟ 🧎",
        "شكون أكثر واحد يطلب يسمع كلام حلو؟ 🗣️❤️",
        "شكون أكثر واحد يحب الصوت الهادي؟ 🤫💕",
        "شكون أكثر واحد عنده طقوس قبل؟ 🕯️",
        "شكون أكثر واحد يحب يكون spontaneous؟ ⚡",
        "شكون أكثر واحد يخطط لكل شيء؟ 📋",
        "شكون أكثر واحد يحب بعد العلاقة؟ 🛌",
        "شكون أكثر واحد يوصل للنجمة بسرعة؟ 💫",
        "شكون أكثر واحد يحتاج وقت باش يوصل؟ ⏳🔥",
        "شكون أكثر واحد عنده طاقة يواصل مرتين؟ 2️⃣🔥",
        "شكون أكثر واحد يعرف يخلي الكل يحلم بيه؟ 🌟💭",
    ]
}

# ============================================================================
# التطبيق الرئيسي
# ============================================================================

class FunnyGameApp:
    def __init__(self, page: ft.Page):
        self.page = page
        self.page.title = "🎉 Funny Questions Game"
        self.page.theme_mode = ft.ThemeMode.DARK
        self.page.rtl = True
        self.page.padding = 15
        self.page.bgcolor = COLORS["bg_dark"]
        self.page.scroll = ft.ScrollMode.AUTO
        
        # بيانات اللعبة
        self.players = ["أحمد", "سارة", "محمد", "فاطمة"]
        self.scores = {p: 0 for p in self.players}
        self.votes = {p: 0 for p in self.players}
        self.current_category = "friends"
        self.current_target = random.choice(self.players)
        
        self.show_main_screen()
    
    def get_random_question(self):
        """جلب سؤال عشوائي من الفئة الحالية"""
        q_list = QUESTIONS.get(self.current_category, QUESTIONS["friends"])
        return random.choice(q_list) if q_list else "شكون أكثر واحد؟"
    
    def show_snackbar(self, message, color=COLORS["accent"]):
        """عرض رسالة منبثقة"""
        self.page.snack_bar = ft.SnackBar(content=ft.Text(message), bgcolor=color)
        self.page.snack_bar.open = True
        self.page.update()
    
    # ========================================================================
    # الشاشة الرئيسية
    # ========================================================================
    
    def show_main_screen(self):
        """الشاشة الرئيسية"""
        self.page.clean()
        
        players_text = " | ".join([f"{p}({self.scores.get(p,0)})" for p in self.players])
        
        self.page.add(
            ft.Column([
                ft.Container(height=20),
                ft.Text("🎉", size=50),
                ft.Text("Funny Questions Game", size=24, weight=ft.FontWeight.BOLD, color=COLORS["accent"]),
                ft.Text("النسخة التونسية", size=14, color=COLORS["text_sub"]),
                ft.Divider(height=20),
                ft.Text(f"👥 {players_text}", size=12, color=COLORS["text_sub"]),
                ft.ElevatedButton("⚙️ إعدادات اللاعبين", on_click=lambda e: self.show_players_screen(),
                                  style=ft.ButtonStyle(bgcolor=COLORS["purple"])),
                ft.Container(height=20),
                ft.Text("📂 إختر الفئة:", size=16, weight=ft.FontWeight.BOLD),
                ft.Row([self._create_category_btn(c) for c in CATEGORY_ORDER], 
                       wrap=True, alignment=ft.MainAxisAlignment.CENTER, spacing=10),
                ft.Container(height=30),
                ft.ElevatedButton("🎮 بداية اللعبة", on_click=lambda e: self.show_game_screen(),
                                  style=ft.ButtonStyle(bgcolor=COLORS["accent"], padding=20), width=250),
            ], horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=15)
        )
    
    def _create_category_btn(self, cat_id):
        cat = CATEGORY_COLORS[cat_id]
        return ft.ElevatedButton(f"{cat['emoji']} {cat['label']}", 
                                  on_click=lambda e, c=cat_id: self._start_game_with_category(c),
                                  style=ft.ButtonStyle(bgcolor=cat["main"]))
    
    def _start_game_with_category(self, cat_id):
        self.current_category = cat_id
        self.show_game_screen()
    
    # ========================================================================
    # شاشة إدارة اللاعبين
    # ========================================================================
    
    def show_players_screen(self):
        """شاشة إدارة اللاعبين"""
        self.page.clean()
        
        inputs = []
        for i, p in enumerate(self.players):
            inp = ft.TextField(value=p, width=200, text_align=ft.TextAlign.CENTER, 
                              bgcolor=COLORS["bg_light"], border_radius=10)
            inputs.append(inp)
        
        def add_player_field(e):
            if len(self.players) < 8:
                self.players.append(f"لاعب {len(self.players)+1}")
                self.scores[self.players[-1]] = 0
                self.votes[self.players[-1]] = 0
                self.show_players_screen()
        
        def save_players(e):
            new_players = [inp.value.strip() for inp in inputs if inp.value.strip()]
            if len(new_players) >= 2:
                old_scores = self.scores
                old_votes = self.votes
                self.players = new_players
                self.scores = {p: old_scores.get(p, 0) for p in self.players}
                self.votes = {p: old_votes.get(p, 0) for p in self.players}
                self.show_main_screen()
            else:
                self.show_snackbar("⚠️ يجب أن يكون هناك 2 لاعبين على الأقل!", COLORS["danger"])
        
        self.page.add(
            ft.Column([
                ft.Row([
                    ft.TextButton("🔙 رجوع", on_click=lambda e: self.show_main_screen(),
                                  style=ft.ButtonStyle(color=COLORS["text_sub"]))
                ], alignment=ft.MainAxisAlignment.START),
                ft.Text("👥 إدارة اللاعبين", size=24, weight=ft.FontWeight.BOLD, color=COLORS["accent"]),
                ft.Text("(من 2 إلى 8 لاعبين)", size=12, color=COLORS["text_sub"]),
                ft.Container(height=20),
            ], horizontal_alignment=ft.CrossAxisAlignment.CENTER)
        )
        
        for inp in inputs:
            self.page.add(ft.Row([inp], alignment=ft.MainAxisAlignment.CENTER))
        
        self.page.add(
            ft.Column([
                ft.ElevatedButton("➕ إضافة لاعب", on_click=add_player_field,
                                  style=ft.ButtonStyle(bgcolor=COLORS["success"])),
                ft.Container(height=10),
                ft.ElevatedButton("💾 حفظ", on_click=save_players,
                                  style=ft.ButtonStyle(bgcolor=COLORS["accent"], padding=15)),
            ], horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=10)
        )
    
    # ========================================================================
    # شاشة اللعب الرئيسية
    # ========================================================================
    
    def show_game_screen(self):
        """شاشة اللعب الرئيسية"""
        self.page.clean()
        
        self.current_target = random.choice(self.players)
        question_text = f"🎯 يا {self.current_target}، {self.get_random_question()}"
        cat = CATEGORY_COLORS[self.current_category]
        
        sorted_players = sorted(self.players, key=lambda p: self.scores.get(p, 0), reverse=True)
        score_text = " | ".join([f"{p}:{self.scores.get(p,0)}" for p in sorted_players[:3]])
        
        self.page.add(
            ft.Column([
                ft.Row([
                    ft.TextButton("🏠 الرئيسية", on_click=lambda e: self.show_main_screen(), 
                                  style=ft.ButtonStyle(color=COLORS["text_sub"])),
                    ft.Text(f"{cat['emoji']} {cat['label']}", size=18, weight=ft.FontWeight.BOLD, color=cat["main"]),
                    ft.TextButton("🔄 جديد", on_click=lambda e: self.show_game_screen(), 
                                  style=ft.ButtonStyle(color=COLORS["text_sub"])),
                ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
                
                ft.Container(height=10),
                
                ft.Container(
                    content=ft.Text(question_text, size=16, weight=ft.FontWeight.BOLD, 
                                   text_align=ft.TextAlign.CENTER),
                    padding=25, bgcolor=COLORS["bg_card"], border_radius=20,
                ),
                
                ft.Text(score_text, size=12, color=COLORS["warning"]),
                ft.Text(f"🎲 دور: {self.current_target}", size=12, color=COLORS["text_sub"]),
                
                ft.Container(height=10),
                
                ft.Text("👇 من هو الشخص المعني؟", size=18, color=COLORS["text_sub"]),
                ft.Row([ft.ElevatedButton(p, on_click=lambda e, player=p: self.vote_for_player(player), 
                                          style=ft.ButtonStyle(bgcolor=cat["main"])) for p in self.players], 
                       wrap=True, spacing=10, alignment=ft.MainAxisAlignment.CENTER),
                
                ft.Container(height=10),
                
                ft.Text("🎁 اختر عدد النقاط:", size=18, color=COLORS["text_sub"]),
                ft.Row([ft.ElevatedButton(f"+{p}", on_click=lambda e, pts=p: self.add_points(pts), 
                                          style=ft.ButtonStyle(bgcolor=COLORS["accent"])) for p in [50,100,200,500]], 
                       spacing=10, alignment=ft.MainAxisAlignment.CENTER),
                
                ft.Container(height=10),
                
                ft.Row([
                    ft.ElevatedButton("🎭 تحدي", on_click=lambda e: self.show_challenge(), 
                                      style=ft.ButtonStyle(bgcolor=COLORS["orange"])),
                    ft.ElevatedButton("🎲 نرد", on_click=lambda e: self.show_dice(), 
                                      style=ft.ButtonStyle(bgcolor=COLORS["cyan"])),
                    ft.ElevatedButton("📊 إحصائيات", on_click=lambda e: self.show_current_stats(), 
                                      style=ft.ButtonStyle(bgcolor=COLORS["purple"])),
                ], alignment=ft.MainAxisAlignment.CENTER, spacing=10),
            ], horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=15)
        )
    
    # ========================================================================
    # إجراءات اللعبة (نسخة تعمل على iOS)
    # ========================================================================
    
    def vote_for_player(self, player):
        """التصويت على لاعب"""
        self.votes[player] = self.votes.get(player, 0) + 1
        self.show_snackbar(f"😂 {player} تحصل على تصويت!")
        self.show_game_screen()
    
    def add_points(self, points):
        """إضافة نقاط للاعب الحالي"""
        self.scores[self.current_target] = self.scores.get(self.current_target, 0) + points
        self.show_snackbar(f"✨ +{points} نقطة لـ {self.current_target} ✨")
        self.show_game_screen()
    
    def show_challenge(self):
        """عرض تحدي عشوائي - يعمل على iOS"""
        challenge = random.choice(CHALLENGES)
        
        def close_popup(e):
            self.page.overlay.clear()
            self.page.update()
        
        # إنشاء نافذة منبثقة يدوية
        popup = ft.Container(
            content=ft.Column([
                ft.Text("🎭 تحدي / عقوبة", size=22, weight=ft.FontWeight.BOLD, color=COLORS["orange"]),
                ft.Divider(),
                ft.Text(f"👤 اللاعب: {self.current_target}", size=18, weight=ft.FontWeight.BOLD, color=COLORS["warning"]),
                ft.Container(height=10),
                ft.Text(challenge, size=16, text_align=ft.TextAlign.CENTER),
                ft.Container(height=20),
                ft.Row([
                    ft.ElevatedButton("✅ تم التنفيذ", on_click=close_popup, 
                                      style=ft.ButtonStyle(bgcolor=COLORS["success"])),
                ], alignment=ft.MainAxisAlignment.CENTER),
            ], spacing=15, horizontal_alignment=ft.CrossAxisAlignment.CENTER),
            width=320,
            padding=25,
            bgcolor=COLORS["bg_card"],
            border_radius=20,
            shadow=ft.BoxShadow(blur_radius=20, color="#00000066"),
        )
        
        self.page.overlay.clear()
        self.page.overlay.append(popup)
        self.page.update()
    
    def show_dice(self):
        """رمي النرد - يعمل على iOS"""
        result = random.randint(1, 6)
        dice_icons = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]
        
        def close_popup(e):
            self.page.overlay.clear()
            self.page.update()
        
        popup = ft.Container(
            content=ft.Column([
                ft.Text("🎲 رمي النرد", size=22, weight=ft.FontWeight.BOLD, color=COLORS["cyan"]),
                ft.Divider(),
                ft.Text(dice_icons[result-1], size=70, text_align=ft.TextAlign.CENTER),
                ft.Text(f"النتيجة: {result}", size=28, weight=ft.FontWeight.BOLD, color=COLORS["warning"]),
                ft.Text("حظ سعيد في المرة القادمة!" if result < 4 else "مبروك! أنت محظوظ اليوم!", 
                       size=14, color=COLORS["text_sub"]),
                ft.Container(height=20),
                ft.Row([
                    ft.ElevatedButton("⏭️ متابعة", on_click=close_popup, 
                                      style=ft.ButtonStyle(bgcolor=COLORS["cyan"])),
                ], alignment=ft.MainAxisAlignment.CENTER),
            ], spacing=15, horizontal_alignment=ft.CrossAxisAlignment.CENTER),
            width=300,
            padding=25,
            bgcolor=COLORS["bg_card"],
            border_radius=20,
            shadow=ft.BoxShadow(blur_radius=20, color="#00000066"),
        )
        
        self.page.overlay.clear()
        self.page.overlay.append(popup)
        self.page.update()
    
    def show_current_stats(self):
        """عرض إحصائيات - يعمل على iOS"""
        sorted_players = sorted(self.players, key=lambda p: self.scores.get(p, 0), reverse=True)
        most_accused = max(self.players, key=lambda p: self.votes.get(p, 0)) if self.players else None
        
        stats = "🏆 ترتيب اللاعبين:\n\n"
        for i, p in enumerate(sorted_players):
            medal = ["🥇", "🥈", "🥉"][i] if i < 3 else "📌"
            stats += f"{medal} {p}: {self.scores.get(p, 0)} نقطة\n"
        
        if most_accused:
            stats += f"\n🔥 أكثر واحد متهم:\n   {most_accused} ({self.votes.get(most_accused, 0)} اتهام)\n"
        stats += f"\n📊 عدد الاتهامات الكلي: {sum(self.votes.values())}"
        
        def close_popup(e):
            self.page.overlay.clear()
            self.page.update()
        
        popup = ft.Container(
            content=ft.Column([
                ft.Text("📊 إحصائيات اللعبة", size=22, weight=ft.FontWeight.BOLD, color=COLORS["accent"]),
                ft.Divider(),
                ft.Text(stats, size=14, color=COLORS["text_white"]),
                ft.Container(height=20),
                ft.Row([
                    ft.ElevatedButton("إغلاق", on_click=close_popup, 
                                      style=ft.ButtonStyle(bgcolor=COLORS["purple"])),
                ], alignment=ft.MainAxisAlignment.CENTER),
            ], spacing=15, horizontal_alignment=ft.CrossAxisAlignment.CENTER),
            width=340,
            padding=20,
            bgcolor=COLORS["bg_card"],
            border_radius=20,
            shadow=ft.BoxShadow(blur_radius=20, color="#00000066"),
        )
        
        self.page.overlay.clear()
        self.page.overlay.append(popup)
        self.page.update()

# ============================================================================
# تشغيل التطبيق
# ============================================================================

def main(page: ft.Page):
    FunnyGameApp(page)

if __name__ == "__main__":
    ft.app(target=main)