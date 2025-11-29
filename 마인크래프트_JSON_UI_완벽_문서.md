# 마인크래프트 베드락 에디션 JSON UI 완벽 문서

## ⚠️ 중요 공지
JSON UI는 **Ore UI**로 대체될 예정입니다. 향후 몇 년 내에 JSON UI를 사용하는 애드온은 작동하지 않을 수 있습니다. Ore UI는 하드코딩되어 있어 리소스 팩으로 수정할 수 없습니다.

---

## 목차

1. [기본 개념](#1-기본-개념)
2. [파일 구조](#2-파일-구조)
3. [네임스페이스](#3-네임스페이스)
4. [UI 요소 타입](#4-ui-요소-타입)
5. [주요 속성](#5-주요-속성)
6. [데이터 바인딩](#6-데이터-바인딩)
7. [애니메이션](#7-애니메이션)
8. [변수와 연산자](#8-변수와-연산자)
9. [HUD 수정](#9-hud-수정)
10. [서버 폼 매핑](#10-서버-폼-매핑)
11. [버튼과 토글](#11-버튼과-토글)
12. [수정 전략](#12-수정-전략)
13. [베스트 프랙티스](#13-베스트-프랙티스)
14. [전체 용어 사전](#14-전체-용어-사전)
15. [고급 기술](#15-고급-기술)

---

## 1. 기본 개념

### 1.1 JSON UI란?

마인크래프트 베드락 에디션의 사용자 인터페이스는 **데이터 기반**으로 작동하며, JSON 파일을 통해 수정할 수 있습니다. JSON UI를 사용하면:

- UI 요소의 렌더링 방식 변경
- 새로운 UI 요소 추가
- 기존 UI 요소 수정
- 동적 데이터 바인딩
- 커스텀 애니메이션 적용

### 1.2 JSON UI의 작동 원리

```
게임 엔진 (하드코딩된 데이터)
    ↓
바인딩 (#bindings)
    ↓
JSON UI 요소
    ↓
화면에 렌더링
```

---

## 2. 파일 구조

### 2.1 파일 위치

모든 JSON UI 파일은 리소스 팩의 `RP/ui/` 폴더에 위치합니다.

```
RP/
├── ui/
│   ├── _ui_defs.json           # 파일 참조 정의
│   ├── _global_variables.json  # 전역 변수
│   ├── hud_screen.json         # HUD 화면
│   ├── inventory_screen.json   # 인벤토리 화면
│   ├── server_form.json        # 서버 폼
│   ├── ui_common.json          # 공통 요소
│   └── ...
```

### 2.2 시스템 파일

#### _ui_defs.json
UI에서 사용할 모든 파일을 참조합니다.

```json
{
    "ui_defs": [
        "ui/my_custom_ui.json",
        "custom_folder/another_ui.json"
    ]
}
```

**중요 사항:**
- 리소스 팩 루트부터의 **전체 경로** 작성
- 파일 확장자 `.json` 포함 필수
- 새로 추가한 파일만 작성 (바닐라 파일은 자동 병합)
- `RP/ui/` 외부 경로도 사용 가능

#### _global_variables.json
프로젝트 전체에서 사용할 변수를 정의합니다.

```json
{
    "$primary_color": [0.2, 0.6, 1.0],
    "$button_width": 100,
    "$button_height": 20,
    "$spacing": 4,
    "$font_size": "normal"
}
```

**특징:**
- 모든 네임스페이스에서 접근 가능
- 수정 불가능한 상수값
- `$` 접두사 필수

### 2.3 화면 파일

| 파일명 | 용도 |
|--------|------|
| `hud_screen.json` | 메인 게임 플레이 HUD (핫바, 체력, 크로스헤어 등) |
| `inventory_screen.json` | 플레이어 인벤토리 UI |
| `chest_screen.json` | 상자 인벤토리 UI |
| `start_screen.json` | 메인 메뉴 화면 |
| `pause_screen.json` | 일시정지 메뉴 |
| `server_form.json` | 서버 폼 (ActionForm, ModalForm) |
| `settings_screen.json` | 설정 화면 |

### 2.4 템플릿 파일

| 파일명 | 용도 |
|--------|------|
| `ui_common.json` | 버튼, 패널 등 공통 요소 |
| `ui_template_buttons.json` | 버튼 템플릿 |
| `ui_template_toggles.json` | 토글 템플릿 |
| `ui_template_*.json` | 기타 템플릿들 |

---

## 3. 네임스페이스

### 3.1 네임스페이스 정의

네임스페이스는 UI 파일의 **고유 식별자**입니다.

```json
{
    "namespace": "my_custom_ui",

    "my_element": {
        "type": "panel",
        "size": [100, 50]
    }
}
```

### 3.2 네임스페이스 참조

다른 네임스페이스의 요소를 참조할 때 `@` 기호를 사용합니다.

```json
{
    "namespace": "main_ui",

    "my_button@ui_common.button": {
        "size": [120, 30]
    }
}
```

**형식:** `요소명@네임스페이스.요소명`

### 3.3 네임스페이스 접두사

충돌 방지를 위해 접두사를 사용할 수 있습니다.

```json
{
    "namespace": "mypack:custom_ui",

    "element@mypack:custom_ui.button": {}
}
```

### 3.4 바닐라 네임스페이스

| 네임스페이스 | 파일 |
|--------------|------|
| `hud` | hud_screen.json |
| `inventory` | inventory_screen.json |
| `chest` | chest_screen.json |
| `common` | ui_common.json |
| `common_buttons` | ui_template_buttons.json |
| `common_toggles` | ui_template_toggles.json |

---

## 4. UI 요소 타입

### 4.1 컨테이너 타입

#### panel
기본 컨테이너 요소 (HTML의 `<div>`와 유사)

```json
{
    "my_panel": {
        "type": "panel",
        "size": [200, 100],
        "controls": [
            { "child1@namespace.element1": {} },
            { "child2@namespace.element2": {} }
        ]
    }
}
```

**특징:**
- 자식 요소들이 겹칠 수 있음
- 레이아웃 제어 없음

#### stack_panel
자식 요소를 한 방향으로 스택

```json
{
    "my_stack": {
        "type": "stack_panel",
        "orientation": "vertical",
        "size": ["100%", "100%c"],
        "controls": [
            { "item1@element": {} },
            { "item2@element": {} },
            { "item3@element": {} }
        ]
    }
}
```

**속성:**
- `orientation`: `"vertical"` (기본값) 또는 `"horizontal"`

#### collection_panel
동적 컬렉션 표시

```json
{
    "my_collection": {
        "type": "collection_panel",
        "size": ["100%", "100%c"],
        "collection_name": "inventory_items",
        "factory": {
            "name": "inventory_item_factory",
            "control_ids": {
                "inventory_item": "item_renderer"
            }
        }
    }
}
```

#### grid
그리드 레이아웃

```json
{
    "item_grid": {
        "type": "grid",
        "size": [162, 54],
        "grid_dimensions": [9, 3],
        "grid_item_template": "container_items",
        "collection_name": "hotbar_items"
    }
}
```

**속성:**
- `grid_dimensions`: [컬럼, 행]
- `maximum_grid_items`: 최대 아이템 수
- `grid_fill_direction`: `"vertical"`, `"horizontal"`, `"none"`

### 4.2 콘텐츠 타입

#### label
텍스트 표시

```json
{
    "title_label": {
        "type": "label",
        "text": "안녕하세요!",
        "color": [1.0, 1.0, 1.0],
        "font_size": "large",
        "font_type": "default",
        "shadow": true,
        "text_alignment": "center"
    }
}
```

**주요 속성:**
- `text`: 표시할 텍스트
- `color`: RGB 색상 (0.0 ~ 1.0)
- `font_size`: `"small"`, `"normal"`, `"large"`, `"extra_large"`
- `font_type`: `"default"`, `"rune"`, `"unicode"`, `"smooth"`
- `shadow`: 그림자 여부
- `localize`: 번역 가능 여부

#### image
이미지/스프라이트 표시

```json
{
    "icon": {
        "type": "image",
        "texture": "textures/ui/icons/apple",
        "size": [16, 16],
        "uv": [0, 0],
        "uv_size": [16, 16],
        "nineslice_size": 4,
        "tiled": false,
        "bilinear": true
    }
}
```

**주요 속성:**
- `texture`: 텍스처 경로
- `uv`: UV 시작 좌표
- `uv_size`: UV 크기
- `nineslice_size`: 9-slice 크기
- `tiled`: 타일 반복 (`true`, `false`, `"x"`, `"y"`)
- `clip_direction`: 클리핑 방향
- `clip_ratio`: 클리핑 비율

### 4.3 인터랙티브 타입

#### button
클릭 가능한 버튼

```json
{
    "my_button": {
        "type": "button",
        "size": [100, 20],
        "default_control": "default_state",
        "hover_control": "hover_state",
        "pressed_control": "pressed_state",
        "locked_control": "locked_state",
        "button_mappings": [
            {
                "from_button_id": "button.menu_select",
                "to_button_id": "button.my_action",
                "mapping_type": "pressed"
            }
        ]
    }
}
```

**상태별 컨트롤:**
- `default_control`: 기본 상태
- `hover_control`: 호버 상태
- `pressed_control`: 눌린 상태
- `locked_control`: 비활성화 상태

#### toggle
체크박스/토글 버튼

```json
{
    "my_toggle": {
        "type": "toggle",
        "size": [80, 20],
        "toggle_name": "my_toggle_id",
        "toggle_default_state": false,
        "checked_control": "checked_state",
        "unchecked_control": "unchecked_state",
        "checked_hover_control": "checked_hover",
        "unchecked_hover_control": "unchecked_hover"
    }
}
```

**상태별 컨트롤:**
- `checked_control`: 체크됨
- `unchecked_control`: 체크 안됨
- `checked_hover_control`: 체크됨 + 호버
- `unchecked_hover_control`: 체크 안됨 + 호버
- `checked_locked_control`: 체크됨 + 잠김
- `unchecked_locked_control`: 체크 안됨 + 잠김

#### slider
슬라이더 입력

```json
{
    "volume_slider": {
        "type": "slider",
        "size": [150, 20],
        "slider_name": "volume",
        "slider_steps": 100,
        "slider_direction": "horizontal",
        "slider_box_control": "slider_thumb",
        "background_control": "slider_bg",
        "progress_control": "slider_progress"
    }
}
```

#### edit_box
텍스트 입력 필드

```json
{
    "text_input": {
        "type": "edit_box",
        "size": [200, 20],
        "text_box_name": "my_textbox",
        "max_length": 50,
        "text_type": "ExtendedASCII",
        "enabled_newline": false,
        "text_control": "input_text",
        "place_holder_control": "placeholder_text"
    }
}
```

**text_type 옵션:**
- `"ExtendedASCII"`: 일반 텍스트
- `"IdentifierChars"`: 식별자 문자만
- `"NumberChars"`: 숫자만

#### scroll_view
스크롤 가능한 뷰

```json
{
    "scroll_area": {
        "type": "scroll_view",
        "size": [200, 150],
        "scroll_speed": 5,
        "scrollbar_box": "scrollbar_thumb",
        "scrollbar_track": "scrollbar_track",
        "scroll_view_port": "viewport",
        "scroll_content": "content_panel"
    }
}
```

### 4.4 특수 타입

#### factory
동적 요소 생성

```json
{
    "item_factory": {
        "type": "panel",
        "factory": {
            "name": "inventory_item_factory",
            "control_ids": {
                "inventory_item": "@namespace.item_template"
            }
        }
    }
}
```

**하드코딩된 팩토리:**
- `server_form_factory`: 서버 폼
- `hud_actionbar_text_factory`: 액션바 텍스트
- `hud_title_text_factory`: 타이틀 텍스트
- `inventory_item_factory`: 인벤토리 아이템

#### custom
커스텀 렌더러

```json
{
    "player_model": {
        "type": "custom",
        "renderer": "live_player_renderer",
        "size": [100, 100],
        "property_bag": {
            "#look_at_cursor": true
        }
    }
}
```

**주요 렌더러:**
- `inventory_item_renderer`: 아이템 렌더링
- `live_player_renderer`: 플레이어 모델
- `paper_doll_renderer`: 스킨 모델
- `heart_renderer`: 체력바
- `hunger_renderer`: 배고픔바
- `armor_renderer`: 방어구바
- `hotbar_renderer`: 핫바
- `gradient_renderer`: 그라데이션
- `progress_bar_renderer`: 진행바
- `hover_text_renderer`: 툴팁

#### screen
루트 화면 요소

```json
{
    "my_screen@common.base_screen": {
        "type": "screen",
        "render_game_behind": true,
        "is_modal": false,
        "should_steal_mouse": true,
        "controls": [
            { "background@background_panel": {} },
            { "content@content_panel": {} }
        ]
    }
}
```

---

## 5. 주요 속성

### 5.1 Control 속성

기본적인 제어 속성입니다.

```json
{
    "element": {
        "visible": true,              // 표시 여부
        "enabled": true,              // 활성화 여부
        "layer": 0,                   // Z-Index
        "alpha": 1.0,                 // 투명도 (0.0 ~ 1.0)
        "propagate_alpha": false,     // 자식에도 alpha 적용
        "clips_children": false,      // 경계 밖 자식 잘라내기
        "allow_clipping": true,       // 클리핑 허용
        "clip_offset": [0, 0],        // 클리핑 오프셋
        "ignored": false,             // 요소 무시 (렌더링 안함)
        "property_bag": {},           // 데이터 속성
        "controls": [],               // 자식 요소 배열
        "anims": [],                  // 애니메이션 배열
        "variables": [],              // 조건부 변수
        "modifications": []           // 수정 배열
    }
}
```

**중요:**
- `visible: false`: 요소가 안 보이지만 여전히 평가됨
- `ignored: true`: 요소와 자식이 완전히 무시됨 (성능 향상)

### 5.2 Layout 속성

레이아웃과 위치 관련 속성입니다.

```json
{
    "element": {
        "size": [100, 50],
        "max_size": [200, 100],
        "min_size": [50, 20],
        "offset": [10, 5],
        "anchor_from": "center",
        "anchor_to": "center",
        "inherit_max_sibling_width": false,
        "inherit_max_sibling_height": false,
        "use_anchored_offset": false,
        "draggable": "both",
        "follows_cursor": false
    }
}
```

#### Size 값 옵션

| 값 | 설명 | 예시 |
|----|------|------|
| `"default"` | 기본값 (100%) | `["default", "default"]` |
| `숫자` | 픽셀 | `[100, 50]` |
| `"숫자px"` | 픽셀 (문자열) | `["100px", "50px"]` |
| `"숫자%"` | 부모 대비 % | `["50%", "100%"]` |
| `"숫자%c"` | 자식 대비 % | `["100%c", "100%c"]` |
| `"숫자%cm"` | 가장 큰 자식 대비 | `["100%cm", "100%cm"]` |
| `"숫자%sm"` | 형제 요소 대비 | `["100%sm", "50%sm"]` |
| `"숫자%x"` | 자신의 너비 대비 | `["100%x", "50%x"]` |
| `"숫자%y"` | 자신의 높이 대비 | `["50%y", "100%y"]` |
| `"fill"` | 남은 공간 채우기 | `["fill", "fill"]` |

**연산 가능:**
```json
"size": ["100% - 20px", "50% + 10px"]
```

#### Anchor 값

| 값 | 설명 |
|----|------|
| `top_left` | 좌상단 |
| `top_middle` | 상단 중앙 |
| `top_right` | 우상단 |
| `left_middle` | 좌측 중앙 |
| `center` | 정중앙 |
| `right_middle` | 우측 중앙 |
| `bottom_left` | 좌하단 |
| `bottom_middle` | 하단 중앙 |
| `bottom_right` | 우하단 |

**Anchor 작동 원리:**
- `anchor_from`: 부모 요소의 앵커 지점
- `anchor_to`: 자신의 앵커 지점
- `anchor_to` 지점이 `anchor_from` 지점에 부착됨

예시:
```json
{
    "element": {
        "anchor_from": "top_left",
        "anchor_to": "center"
    }
}
```
→ 요소의 중심이 부모의 좌상단에 위치

### 5.3 Text 속성 (label)

```json
{
    "text_element": {
        "type": "label",
        "text": "Hello World",
        "color": [1.0, 1.0, 1.0],
        "locked_color": [0.5, 0.5, 0.5],
        "shadow": true,
        "font_size": "normal",
        "font_scale_factor": 1.0,
        "font_type": "default",
        "backup_font_type": "default",
        "text_alignment": "center",
        "line_padding": 0,
        "localize": false,
        "hide_hyphen": false,
        "enable_profanity_filter": false,
        "notify_on_ellipses": ["button_name"]
    }
}
```

**font_size 옵션:**
- `"small"`: 작은 크기
- `"normal"`: 보통 크기 (기본값)
- `"large"`: 큰 크기
- `"extra_large"`: 매우 큰 크기

**font_type 옵션:**
- `"default"`: 기본 폰트
- `"rune"`: 룬 폰트
- `"unicode"`: 유니코드 폰트
- `"smooth"`: 부드러운 폰트
- `"MinecraftTen"`: 마인크래프트 10주년 폰트

**text_alignment 옵션:**
- `"left"`: 좌측 정렬
- `"center"`: 중앙 정렬
- `"right"`: 우측 정렬

### 5.4 Sprite 속성 (image)

```json
{
    "image_element": {
        "type": "image",
        "texture": "textures/ui/White",
        "uv": [0, 0],
        "uv_size": [16, 16],
        "nineslice_size": [4, 4, 4, 4],
        "tiled": false,
        "tiled_scale": [1, 1],
        "clip_direction": "left",
        "clip_ratio": 0.5,
        "clip_pixelperfect": false,
        "keep_ratio": true,
        "bilinear": false,
        "fill": false,
        "grayscale": false,
        "force_texture_reload": false,
        "allow_debug_missing_texture": true
    }
}
```

**clip_direction 옵션:**
- `"left"`: 좌측부터 클리핑
- `"right"`: 우측부터 클리핑
- `"up"`: 위부터 클리핑
- `"down"`: 아래부터 클리핑
- `"center"`: 중앙부터 클리핑

**nineslice_size:**
- 단일 값: `4` → 모든 모서리에 4px
- 배열: `[4, 4, 4, 4]` → [좌, 상, 우, 하]

### 5.5 Input 속성

```json
{
    "interactive_element": {
        "button_mappings": [
            {
                "from_button_id": "button.menu_select",
                "to_button_id": "button.my_action",
                "mapping_type": "pressed",
                "scope": "view"
            }
        ],
        "modal": false,
        "inline_modal": false,
        "always_listen_to_input": false,
        "always_handle_pointer": false,
        "hover_enabled": true,
        "prevent_touch_input": false,
        "consume_event": false,
        "consume_hover_events": true
    }
}
```

**mapping_type 옵션:**
- `"global"`: 전역 (화면에 존재할 때)
- `"pressed"`: 눌렸을 때
- `"focused"`: 포커스될 때
- `"double_pressed"`: 더블 클릭

### 5.6 Focus 속성

```json
{
    "focusable_element": {
        "default_focus_precedence": 1,
        "focus_enabled": true,
        "focus_identifier": "my_element",
        "focus_change_down": "element_below",
        "focus_change_up": "element_above",
        "focus_change_left": "element_left",
        "focus_change_right": "element_right",
        "focus_container": true,
        "use_last_focus": false,
        "focus_navigation_mode_down": "contained",
        "focus_container_custom_down": [
            {
                "other_focus_container_name": "other_panel",
                "focus_id_inside": "specific_element"
            }
        ]
    }
}
```

**focus_navigation_mode 옵션:**
- `"none"`: 네비게이션 없음
- `"stop"`: 경계에서 멈춤
- `"custom"`: 커스텀 동작
- `"contained"`: 컨테이너 내부만

---

## 6. 데이터 바인딩

### 6.1 바인딩 기본

바인딩은 하드코딩된 값을 UI 요소에 연결합니다.

```json
{
    "label": {
        "type": "label",
        "text": "#hardcoded_text",
        "bindings": [
            {
                "binding_name": "#hardcoded_text"
            }
        ]
    }
}
```

### 6.2 바인딩 타입

#### global
전역 바인딩

```json
{
    "bindings": [
        {
            "binding_type": "global",
            "binding_name": "#hud_title_text_string",
            "binding_name_override": "#text"
        }
    ]
}
```

#### view
다른 요소 속성 참조

```json
{
    "panel": {
        "type": "panel",
        "bindings": [
            {
                "binding_type": "view",
                "source_control_name": "my_toggle",
                "source_property_name": "#toggle_state",
                "target_property_name": "#visible"
            }
        ]
    }
}
```

#### collection
컬렉션 데이터 바인딩

```json
{
    "bindings": [
        {
            "binding_type": "collection",
            "binding_collection_name": "inventory_items"
        }
    ]
}
```

#### collection_details
컬렉션 세부 정보

```json
{
    "bindings": [
        {
            "binding_type": "collection_details",
            "binding_collection_name": "inventory_items"
        }
    ]
}
```

### 6.3 바인딩 조건

```json
{
    "bindings": [
        {
            "binding_name": "#data",
            "binding_condition": "always"
        }
    ]
}
```

**binding_condition 옵션:**
- `"always"`: 항상
- `"always_when_visible"`: 표시될 때만 항상
- `"visible"`: 표시될 때만
- `"once"`: 한 번만
- `"none"`: 없음
- `"visibility_changed"`: 표시 상태 변경 시

### 6.4 주요 바인딩 속성

| 속성 | 타입 | 설명 |
|------|------|------|
| `binding_type` | enum | global, view, collection, collection_details |
| `binding_name` | string | 바인딩 이름 |
| `binding_name_override` | string | 오버라이드할 속성 이름 |
| `binding_collection_name` | string | 컬렉션 이름 |
| `binding_condition` | enum | 바인딩 조건 |
| `source_control_name` | string | 참조할 요소 이름 |
| `source_property_name` | string | 참조할 속성 이름 |
| `target_property_name` | string | 적용할 속성 이름 |
| `resolve_sibling_scope` | boolean | 형제 요소 참조 여부 |

### 6.5 Property Bag

데이터 관련 속성을 저장하는 컨테이너입니다.

```json
{
    "element": {
        "type": "custom",
        "renderer": "paper_doll_renderer",
        "property_bag": {
            "#look_at_cursor": true,
            "#skin_rotation": true,
            "entity_type": "player"
        }
    }
}
```

**주요 Property Bag 속성:**

| 속성 | 타입 | 렌더러 | 설명 |
|------|------|--------|------|
| `#visible` | boolean | 모든 요소 | 표시 여부 |
| `#enabled` | boolean | 모든 요소 | 활성화 여부 |
| `#text` | string | label | 텍스트 내용 |
| `#texture` | string | image | 텍스처 경로 |
| `#toggle_state` | boolean | toggle | 토글 상태 |
| `#slider_value` | number | slider | 슬라이더 값 |
| `#hover_text` | string | hover_text_renderer | 호버 텍스트 |
| `#item_id_aux` | int | inventory_item_renderer | 아이템 ID |
| `#look_at_cursor` | boolean | hud_player_renderer | 커서 바라보기 |

---

## 7. 애니메이션

### 7.1 애니메이션 정의

`type` 대신 `anim_type`을 사용합니다.

```json
{
    "fade_in_anim": {
        "anim_type": "alpha",
        "from": 0.0,
        "to": 1.0,
        "duration": 0.5,
        "easing": "in_out_sine"
    }
}
```

### 7.2 애니메이션 타입

#### alpha - 투명도

```json
{
    "alpha_anim": {
        "anim_type": "alpha",
        "from": 1.0,
        "to": 0.0,
        "duration": 1.0,
        "easing": "linear"
    }
}
```

#### offset - 위치

```json
{
    "move_anim": {
        "anim_type": "offset",
        "from": [0, 0],
        "to": [100, 50],
        "duration": 2.0,
        "easing": "in_out_quad"
    }
}
```

#### size - 크기

```json
{
    "grow_anim": {
        "anim_type": "size",
        "from": [50, 50],
        "to": [100, 100],
        "duration": 1.5,
        "easing": "out_bounce"
    }
}
```

#### color - 색상

```json
{
    "color_anim": {
        "anim_type": "color",
        "from": [1.0, 0.0, 0.0],
        "to": [0.0, 1.0, 0.0],
        "duration": 3.0,
        "easing": "linear"
    }
}
```

#### flip_book - 프레임 애니메이션

```json
{
    "flip_anim": {
        "anim_type": "flip_book",
        "initial_uv": [0, 0],
        "frame_count": 10,
        "fps": 24,
        "frame_step": 1
    }
}
```

#### uv - UV 애니메이션

```json
{
    "uv_anim": {
        "anim_type": "uv",
        "from": [0, 0],
        "to": [16, 16],
        "duration": 1.0
    }
}
```

#### wait - 대기

```json
{
    "wait_anim": {
        "anim_type": "wait",
        "duration": 2.0,
        "next": "@namespace.next_anim"
    }
}
```

### 7.3 Easing 함수

| 함수 | 설명 |
|------|------|
| `linear` | 선형 |
| `spring` | 스프링 |
| `in_quad`, `out_quad`, `in_out_quad` | 2차 함수 |
| `in_cubic`, `out_cubic`, `in_out_cubic` | 3차 함수 |
| `in_quart`, `out_quart`, `in_out_quart` | 4차 함수 |
| `in_quint`, `out_quint`, `in_out_quint` | 5차 함수 |
| `in_sine`, `out_sine`, `in_out_sine` | 사인 함수 |
| `in_expo`, `out_expo`, `in_out_expo` | 지수 함수 |
| `in_circ`, `out_circ`, `in_out_circ` | 원형 함수 |
| `in_bounce`, `out_bounce`, `in_out_bounce` | 바운스 |
| `in_back`, `out_back`, `in_out_back` | 백 |
| `in_elastic`, `out_elastic`, `in_out_elastic` | 탄성 |

### 7.4 애니메이션 속성

```json
{
    "my_anim": {
        "anim_type": "offset",
        "from": [0, 0],
        "to": [100, 0],
        "duration": 1.0,
        "easing": "in_out_sine",
        "next": "@namespace.next_anim",
        "play_event": "button.start_anim",
        "end_event": "button.end_anim",
        "reset_event": "button.reset_anim",
        "reversible": false,
        "resettable": true,
        "destroy_at_end": "element_name"
    }
}
```

### 7.5 애니메이션 사용

```json
{
    "animated_element": {
        "type": "panel",
        "size": [100, 100],
        "anims": [
            "@namespace.fade_in_anim",
            "@namespace.move_anim"
        ]
    }
}
```

### 7.6 버튼으로 애니메이션 트리거

```json
{
    "my_anim": {
        "anim_type": "offset",
        "from": [0, 0],
        "to": [-50, 0],
        "duration": 0.5,
        "play_event": "button.trigger_anim"
    },

    "my_button@common_buttons.light_text_button": {
        "$pressed_button_name": "button.trigger_anim",
        "$button_text": "애니메이션 재생"
    },

    "animated_panel": {
        "type": "panel",
        "anims": ["@namespace.my_anim"]
    }
}
```

---

## 8. 변수와 연산자

### 8.1 변수 정의

변수는 `$` 기호로 시작합니다.

```json
{
    "element": {
        "$my_var": 100,
        "$color_var": [1.0, 0.5, 0.0],
        "$text_var": "Hello",
        "$bool_var": true,
        "$array_var": [10, 20],

        "size": "$array_var",
        "color": "$color_var"
    }
}
```

### 8.2 변수 상속

```json
{
    "base_element": {
        "$width": 100,
        "$height": 50,
        "size": ["$width", "$height"]
    },

    "extended_element@base_element": {
        "$width": 200
        // $height는 50 유지
    }
}
```

### 8.3 기본값 설정

```json
{
    "element": {
        "$size|default": [100, 50],
        "size": "$size"
    }
}
```

### 8.4 조건부 변수

```json
{
    "element": {
        "$base_size": [100, 50],
        "size": "$base_size",
        "variables": [
            {
                "requires": "$is_large",
                "$base_size": [200, 100]
            },
            {
                "requires": "$is_small",
                "$base_size": [50, 25]
            }
        ]
    }
}
```

### 8.5 산술 연산자

```json
{
    "element": {
        // 덧셈
        "size": ["100% + 20px", "$height + 10"],

        // 뺄셈
        "offset": ["50% - 10px", "$y - 5"],

        // 곱셈
        "size": ["$width * 2", "$height * 0.5"],

        // 나눗셈
        "size": ["$width / 2", "100% / 3"]
    }
}
```

### 8.6 비교 연산자

```json
{
    "element": {
        // 같음
        "visible": "($var = 10)",
        "visible": "(#text = 'hello')",

        // 크다
        "visible": "(#value > 5)",

        // 작다
        "visible": "($count < 10)",

        // 크거나 같음
        "visible": "(#value > 5 or #value = 5)",

        // 작거나 같음
        "visible": "(#value < 10 or #value = 10)"
    }
}
```

### 8.7 논리 연산자

```json
{
    "element": {
        // AND
        "visible": "($is_enabled and $is_visible)",

        // OR
        "visible": "($is_red or $is_blue)",

        // NOT
        "visible": "(not $is_hidden)",
        "visible": "(not (#value = 0))"
    }
}
```

### 8.8 문자열 연산

```json
{
    "element": {
        // 문자열 연결
        "text": "($first + ' ' + $last)",

        // 문자열 제거
        "visible": "((#title_text - 'prefix:') = #title_text)",

        // 문자열 포함 확인
        "visible": "(not ((#text - 'keyword') = #text))"
    }
}
```

### 8.9 문자열 포맷

```json
{
    "element": {
        "$text": "abcdefghijklmn",

        // 앞 7바이트
        "text": "('%.7s' * $text)",  // "abcdefg"

        // 최소 15바이트면 전체, 아니면 "0"
        "text": "('%015s' * $text)", // "0"

        // 앞 4바이트, 총 7바이트로 패딩
        "text": "('%7.4s' * $text)", // "   abcd"

        // 뒤쪽 패딩
        "text": "('%-7.4s' * $text)", // "abcd   "
    }
}
```

**중요:** 문자열 길이는 **바이트** 단위입니다.
- ASCII 문자: 1바이트
- 특수문자 (§ 등): 2바이트
- 이모지, 한글 등: 3바이트

### 8.10 조건부 렌더링

#### 변수로 조건부 렌더링

```json
{
    "conditional_image": {
        "type": "image",
        "texture": "textures/ui/apple",
        "size": [16, 16],
        "$atext": "$actionbar_text",
        "visible": "($atext = 'show_apple')"
    }
}
```

#### 바인딩으로 조건부 렌더링

```json
{
    "conditional_image": {
        "type": "image",
        "texture": "textures/ui/apple",
        "size": [16, 16],
        "bindings": [
            {
                "binding_name": "#hud_title_text_string"
            },
            {
                "binding_type": "view",
                "source_property_name": "(#hud_title_text_string = 'show_apple')",
                "target_property_name": "#visible"
            }
        ]
    }
}
```

---

## 9. HUD 수정

### 9.1 HUD 구조

HUD 화면은 `hud_screen.json`에 정의되어 있으며, `root_panel`이 모든 HUD 요소를 포함합니다.

```
root_panel
├── hud_content
│   ├── hotbar
│   ├── health
│   ├── hunger
│   └── ...
├── chat_panel
├── boss_health_panel
└── ...
```

### 9.2 개별 요소 추가

```json
{
    "namespace": "hud",

    "my_hud_image": {
        "type": "image",
        "texture": "textures/ui/custom_icon",
        "size": [32, 32],
        "anchor_from": "top_middle",
        "anchor_to": "top_middle",
        "offset": [0, 10]
    },

    "my_hud_text": {
        "type": "label",
        "text": "커스텀 텍스트",
        "color": [1.0, 1.0, 1.0],
        "anchor_from": "top_right",
        "anchor_to": "top_right",
        "offset": [-10, 10]
    },

    "root_panel": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_front",
                "value": [
                    { "my_hud_image@hud.my_hud_image": {} },
                    { "my_hud_text@hud.my_hud_text": {} }
                ]
            }
        ]
    }
}
```

### 9.3 패널로 그룹화

```json
{
    "custom_hud_elements": {
        "type": "panel",
        "controls": [
            { "image@my_hud_image": {} },
            { "text@my_hud_text": {} },
            { "other@my_other_element": {} }
        ]
    },

    "root_panel": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_front",
                "value": [
                    { "custom_elements@hud.custom_hud_elements": {} }
                ]
            }
        ]
    }
}
```

### 9.4 팩토리 사용

```json
{
    "custom_actionbar": {
        "type": "image",
        "texture": "textures/ui/custom_bg",
        "size": [200, 30],
        "$atext": "$actionbar_text",
        "visible": "($atext = 'custom:')"
    },

    "custom_actionbar_factory": {
        "type": "panel",
        "factory": {
            "name": "hud_actionbar_text_factory",
            "control_ids": {
                "hud_actionbar_text": "@hud.custom_actionbar"
            }
        }
    },

    "root_panel": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_front",
                "value": [
                    { "factory@hud.custom_actionbar_factory": {} }
                ]
            }
        ]
    }
}
```

### 9.5 기존 요소 숨기기

```json
{
    "hud_actionbar_text": {
        "modifications": [
            {
                "array_name": "bindings",
                "operation": "insert_back",
                "value": [
                    {
                        "binding_name": "#title_text"
                    },
                    {
                        "binding_type": "view",
                        "source_property_name": "((#title_text - 'custom:') = #title_text)",
                        "target_property_name": "#visible"
                    }
                ]
            }
        ]
    }
}
```

### 9.6 진행바 만들기

```json
{
    "health_bar_bg": {
        "type": "image",
        "texture": "textures/ui/bar_bg",
        "size": [100, 10]
    },

    "health_bar_fill": {
        "type": "image",
        "texture": "textures/ui/bar_fill",
        "size": ["100%", "100%"],
        "clip_direction": "left",
        "bindings": [
            {
                "binding_name": "#player_health",
                "binding_type": "global"
            },
            {
                "binding_type": "view",
                "source_property_name": "(#player_health / 20.0)",
                "target_property_name": "#clip_ratio"
            }
        ]
    },

    "health_bar": {
        "type": "panel",
        "size": [100, 10],
        "anchor_from": "top_left",
        "anchor_to": "top_left",
        "offset": [10, 10],
        "controls": [
            { "bg@health_bar_bg": {} },
            { "fill@health_bar_fill": { "layer": 1 } }
        ]
    }
}
```

---

## 10. 서버 폼 매핑

서버 폼은 서버에서 보내는 커스텀 UI입니다. ActionForm (long_form), ModalForm (custom_form), MessageForm이 있습니다.

### 10.1 ActionForm 수정

ActionForm은 버튼 목록이 있는 폼입니다.

```json
{
    "namespace": "server_form",

    // 커스텀 폼 패널 정의
    "my_action_form_panel": {
        "type": "panel",
        "bindings": [
            {
                "binding_name": "#title_text"
            }
        ],
        "controls": [
            {
                "custom_content": {
                    "type": "image",
                    "texture": "textures/ui/custom_icon",
                    "size": [32, 32],
                    "$title_keyword": "myform:",
                    "bindings": [
                        {
                            "binding_type": "view",
                            "source_control_name": "my_action_form_panel",
                            "source_property_name": "(not ((#title_text - $title_keyword) = #title_text))",
                            "target_property_name": "#visible"
                        }
                    ]
                }
            }
        ]
    },

    // 기존 폼 숨기기
    "long_form": {
        "modifications": [
            {
                "array_name": "bindings",
                "operation": "insert_back",
                "value": [
                    {
                        "binding_name": "#title_text"
                    },
                    {
                        "binding_type": "view",
                        "source_property_name": "((#title_text - 'myform:') = #title_text)",
                        "target_property_name": "#visible"
                    }
                ]
            }
        ]
    },

    // 팩토리 등록
    "main_screen_content": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_back",
                "value": [
                    {
                        "my_form_factory": {
                            "type": "panel",
                            "factory": {
                                "name": "server_form_factory",
                                "control_ids": {
                                    "long_form": "@server_form.my_action_form_panel"
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
}
```

### 10.2 ModalForm 수정

ModalForm은 입력 필드가 있는 폼입니다.

```json
{
    "my_modal_form_panel": {
        "type": "panel",
        "bindings": [
            {
                "binding_name": "#title_text"
            }
        ],
        "controls": [
            {
                "custom_content": {
                    "type": "panel",
                    "$title_keyword": "mymodal:",
                    "bindings": [
                        {
                            "binding_type": "view",
                            "source_control_name": "my_modal_form_panel",
                            "source_property_name": "(not ((#title_text - $title_keyword) = #title_text))",
                            "target_property_name": "#visible"
                        }
                    ],
                    "controls": [
                        // 커스텀 UI 요소들
                    ]
                }
            }
        ]
    },

    "custom_form": {
        "modifications": [
            {
                "array_name": "bindings",
                "operation": "insert_back",
                "value": [
                    {
                        "binding_name": "#title_text"
                    },
                    {
                        "binding_type": "view",
                        "source_property_name": "((#title_text - 'mymodal:') = #title_text)",
                        "target_property_name": "#visible"
                    }
                ]
            }
        ]
    },

    "main_screen_content": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_back",
                "value": [
                    {
                        "my_modal_factory": {
                            "type": "panel",
                            "factory": {
                                "name": "server_form_factory",
                                "control_ids": {
                                    "custom_form": "@server_form.my_modal_form_panel"
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
}
```

### 10.3 버튼 매핑

서버 폼의 버튼을 커스텀 버튼에 매핑할 수 있습니다.

```json
{
    "custom_button@common_buttons.light_text_button": {
        "$button_text": "커스텀 버튼",
        "size": [100, 30],
        "bindings": [
            {
                "binding_type": "collection",
                "binding_collection_name": "form_buttons",
                "binding_name": "#form_button_text",
                "binding_name_override": "#button_text"
            }
        ],
        "button_mappings": [
            {
                "from_button_id": "button.menu_select",
                "to_button_id": "button.form_button_click",
                "mapping_type": "pressed"
            }
        ]
    }
}
```

---

## 11. 버튼과 토글

### 11.1 기본 버튼

```json
{
    "my_button@common_buttons.light_text_button": {
        "size": [100, 30],
        "$button_text": "클릭하세요",
        "$pressed_button_name": "button.menu_exit"
    }
}
```

### 11.2 커스텀 버튼

```json
{
    "my_custom_button": {
        "type": "button",
        "size": [120, 40],
        "$pressed_button_name": "button.my_action",

        "default_control": "default_state",
        "hover_control": "hover_state",
        "pressed_control": "pressed_state",
        "locked_control": "locked_state",

        "controls": [
            {
                "default_state": {
                    "type": "image",
                    "texture": "textures/ui/button_default"
                }
            },
            {
                "hover_state": {
                    "type": "image",
                    "texture": "textures/ui/button_hover"
                }
            },
            {
                "pressed_state": {
                    "type": "image",
                    "texture": "textures/ui/button_pressed"
                }
            },
            {
                "locked_state": {
                    "type": "image",
                    "texture": "textures/ui/button_locked"
                }
            }
        ],

        "button_mappings": [
            {
                "from_button_id": "button.menu_select",
                "to_button_id": "$pressed_button_name",
                "mapping_type": "pressed"
            },
            {
                "from_button_id": "button.menu_ok",
                "to_button_id": "$pressed_button_name",
                "mapping_type": "focused"
            }
        ]
    }
}
```

### 11.3 기본 토글

```json
{
    "my_toggle@common_toggles.light_text_toggle": {
        "size": [80, 30],
        "$button_text": "토글",
        "$toggle_name": "my_toggle",
        "$toggle_view_binding_name": "my_toggle_state"
    }
}
```

### 11.4 커스텀 토글

```json
{
    "my_custom_toggle": {
        "type": "toggle",
        "size": [60, 30],
        "$toggle_name": "my_toggle",
        "$toggle_view_binding_name": "my_toggle_state",
        "toggle_default_state": false,

        "checked_control": "checked",
        "unchecked_control": "unchecked",
        "checked_hover_control": "checked_hover",
        "unchecked_hover_control": "unchecked_hover",

        "controls": [
            {
                "checked": {
                    "type": "image",
                    "texture": "textures/ui/toggle_on"
                }
            },
            {
                "unchecked": {
                    "type": "image",
                    "texture": "textures/ui/toggle_off"
                }
            },
            {
                "checked_hover": {
                    "type": "image",
                    "texture": "textures/ui/toggle_on_hover"
                }
            },
            {
                "unchecked_hover": {
                    "type": "image",
                    "texture": "textures/ui/toggle_off_hover"
                }
            }
        ]
    }
}
```

### 11.5 토글로 UI 제어

```json
{
    "my_toggle@common_toggles.light_text_toggle": {
        "$toggle_view_binding_name": "panel_toggle"
    },

    "controlled_panel": {
        "type": "panel",
        "size": [200, 100],
        "bindings": [
            {
                "binding_type": "view",
                "source_control_name": "panel_toggle",
                "source_property_name": "#toggle_state",
                "target_property_name": "#visible"
            }
        ]
    }
}
```

### 11.6 호버 텍스트 버튼

```json
{
    "hover_button@common_buttons.light_content_button": {
        "size": [20, 20],
        "$button_content": "namespace.button_content",
        "$pressed_button_name": "button.my_action"
    },

    "button_content": {
        "type": "panel",
        "controls": [
            {
                "icon": {
                    "type": "image",
                    "texture": "textures/ui/icon",
                    "size": [16, 16]
                }
            },
            {
                "hover_text@common.hover_text": {
                    "ignored": "$default_state",
                    "property_bag": {
                        "#hover_text": "버튼 설명"
                    }
                }
            }
        ]
    }
}
```

### 11.7 버튼 매핑

```json
{
    "mapped_button": {
        "type": "button",
        "$pressed_button_name": "button.my_action",
        "button_mappings": [
            // 마우스 클릭
            {
                "from_button_id": "button.menu_select",
                "to_button_id": "$pressed_button_name",
                "mapping_type": "pressed"
            },
            // Enter 키 (포커스 필요)
            {
                "from_button_id": "button.menu_ok",
                "to_button_id": "$pressed_button_name",
                "mapping_type": "focused"
            },
            // 전역 단축키 (E 키)
            {
                "from_button_id": "button.menu_inventory_cancel",
                "to_button_id": "$pressed_button_name",
                "mapping_type": "global"
            },
            // 컨트롤러
            {
                "from_button_id": "button.controller_select",
                "to_button_id": "$pressed_button_name",
                "mapping_type": "pressed"
            }
        ]
    }
}
```

### 11.8 주요 버튼 ID

| 버튼 ID | 키보드/마우스 | 컨트롤러 |
|---------|---------------|----------|
| `button.menu_select` | 마우스 좌클릭 | - |
| `button.controller_select` | - | X/A 버튼 |
| `button.menu_ok` | Enter | - |
| `button.menu_exit` | ESC | B 버튼 |
| `button.menu_cancel` | ESC | B 버튼 |
| `button.menu_up` | ↑ | ↑ DPAD |
| `button.menu_down` | ↓ | ↓ DPAD |
| `button.menu_left` | ← | ← DPAD |
| `button.menu_right` | → | → DPAD |
| `button.menu_tab_left` | Q | LB |
| `button.menu_tab_right` | E | RB |
| `button.menu_autocomplete` | Tab | - |
| `button.menu_inventory_cancel` | E (인벤토리 열기) | - |

---

## 12. 수정 전략

### 12.1 수정 연산

```json
{
    "element": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_back",
                "value": [...]
            }
        ]
    }
}
```

#### 수정 연산 목록

| 연산 | 설명 | 필요 속성 |
|------|------|-----------|
| `insert_back` | 배열 끝에 삽입 | `array_name`, `value` |
| `insert_front` | 배열 시작에 삽입 | `array_name`, `value` |
| `insert_after` | 대상 뒤에 삽입 | `control_name`/`where`, `value` |
| `insert_before` | 대상 앞에 삽입 | `control_name`/`where`, `value` |
| `move_back` | 대상을 끝으로 이동 | `control_name`/`where` |
| `move_front` | 대상을 시작으로 이동 | `control_name`/`where` |
| `move_after` | 대상1을 대상2 뒤로 | `where`, `target` |
| `move_before` | 대상1을 대상2 앞으로 | `where`, `target` |
| `swap` | 두 대상 교환 | `where`, `target` |
| `replace` | 대상 교체 | `where`, `value` |
| `remove` | 대상 제거 | `where` |

### 12.2 배열 끝/시작 삽입

```json
{
    "root_panel": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_back",
                "value": [
                    { "my_element@namespace.element": {} }
                ]
            }
        ]
    }
}
```

### 12.3 특정 위치 삽입

```json
{
    // 컨트롤 뒤에 삽입
    "array_name": "controls",
    "operation": "insert_after",
    "control_name": "existing_control",
    "value": [
        { "new_control@namespace.element": {} }
    ]
}
```

### 12.4 바인딩 수정

```json
{
    "element": {
        "modifications": [
            {
                "array_name": "bindings",
                "operation": "insert_after",
                "where": {
                    "binding_name": "#existing_binding"
                },
                "value": [
                    {
                        "binding_name": "#new_binding"
                    }
                ]
            }
        ]
    }
}
```

### 12.5 요소 제거

```json
{
    "element": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "remove",
                "control_name": "unwanted_control"
            }
        ]
    }
}
```

### 12.6 바인딩 제거

```json
{
    "array_name": "bindings",
    "operation": "remove",
    "where": {
        "binding_name": "#binding_to_remove"
    }
}
```

### 12.7 요소 교체

```json
{
    "array_name": "controls",
    "operation": "replace",
    "control_name": "old_control",
    "value": [
        { "new_control@namespace.better_element": {} }
    ]
}
```

### 12.8 중첩 요소 수정

`/`를 사용하여 중첩된 자식 요소를 수정합니다.

```json
{
    "parent_element/child_element": {
        "size": [100, 50]
    },

    "parent_element/child_element/grandchild": {
        "color": [1.0, 0.0, 0.0]
    }
}
```

---

## 13. 베스트 프랙티스

### 13.1 호환성 최대화

#### ✅ 권장사항

**필요한 것만 수정**
```json
// ❌ 나쁜 예 - 전체 파일 복사
{
    "progress_text_label": {
        "type": "label",
        "shadow": false,
        "text": "#level_number",
        "color": "$experience_text_color",
        "anchor_from": "top_middle",
        "anchor_to": "bottom_middle",
        "bindings": [...]
    }
}

// ✅ 좋은 예 - 필요한 것만
{
    "progress_text_label": {
        "shadow": false
    }
}
```

**수정 전략 사용**
```json
// ❌ 나쁜 예 - 직접 병합
{
    "root_panel": {
        "type": "panel",
        "controls": [
            { "custom_ui@namespace.custom_ui": {} },
            { "left_helpers@$left_helpers": {} },
            // ... 모든 바닐라 컨트롤 복사
        ]
    }
}

// ✅ 좋은 예 - modifications 사용
{
    "root_panel": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_front",
                "value": [
                    { "custom_ui@namespace.custom_ui": {} }
                ]
            }
        ]
    }
}
```

**단일 진입점**
```json
// ❌ 나쁜 예 - 여러 진입점
{
    "root_panel": {
        "modifications": [...]
    },
    "hud_content": {
        "modifications": [...]
    },
    "another_panel": {
        "modifications": [...]
    }
}

// ✅ 좋은 예 - 하나의 진입점
{
    "root_panel": {
        "modifications": [
            {
                "array_name": "controls",
                "operation": "insert_front",
                "value": [
                    { "all_custom_ui@namespace.main_panel": {} }
                ]
            }
        ]
    }
}
```

**커스텀 네임스페이스 사용**
```json
// ❌ 나쁜 예 - 바닐라 네임스페이스에 추가
{
    "namespace": "hud",
    "my_custom_element": {...}
}

// ✅ 좋은 예 - 커스텀 네임스페이스
{
    "namespace": "mypack:custom_hud",
    "my_custom_element": {...}
}
```

### 13.2 성능 최적화

#### 연산자 최소화

```json
// ❌ 나쁜 예
"$var": "(2 * (-1 * $number))"

// ✅ 좋은 예
"$var": "(-2 * $number)"
```

#### 불필요한 요소 제거

```json
// ❌ 나쁜 예 - visible: false (여전히 평가됨)
{
    "unused_element": {
        "type": "panel",
        "visible": false,
        "controls": [...]
    }
}

// ✅ 좋은 예 - ignored: true (완전히 무시)
{
    "unused_element": {
        "ignored": true
    }
}
```

#### 바인딩 최소화

```json
// ❌ 나쁜 예 - 불필요한 바인딩
{
    "element": {
        "bindings": [
            { "binding_name": "#unused_1" },
            { "binding_name": "#unused_2" },
            { "binding_name": "#actual_binding" }
        ]
    }
}

// ✅ 좋은 예 - 필요한 것만
{
    "element": {
        "bindings": [
            { "binding_name": "#actual_binding" }
        ]
    }
}
```

#### 요소 통합

```json
// ❌ 나쁜 예 - 여러 조건부 요소
{
    "image_1": {
        "bindings": [
            {
                "binding_type": "view",
                "source_property_name": "(#text = '1')",
                "target_property_name": "#visible"
            }
        ]
    },
    "image_2": {...},
    "image_3": {...}
}

// ✅ 좋은 예 - 하나로 통합
{
    "dynamic_image": {
        "texture": "#texture",
        "bindings": [
            {
                "binding_name": "#text"
            },
            {
                "binding_type": "view",
                "source_property_name": "('textures/ui/image_' + #text)",
                "target_property_name": "#texture"
            }
        ]
    }
}
```

### 13.3 유지보수성

#### 변수 활용

```json
// ✅ 좋은 예 - 변수로 중앙 관리
{
    "$primary_color": [0.2, 0.6, 1.0],
    "$spacing": 4,
    "$button_height": 20,

    "button_1": {
        "color": "$primary_color",
        "offset": [0, "$spacing"]
    },
    "button_2": {
        "color": "$primary_color",
        "offset": [0, "$spacing * 2"]
    }
}
```

#### 주석 활용

```json
{
    // 플레이어 체력바 패널
    "health_panel": {
        "type": "panel",
        // 크기는 하트 10개 + 간격
        "size": ["(16 * 10) + (4 * 9)", 16],
        "controls": [...]
    }
}
```

---

## 14. 전체 용어 사전

### 14.1 핵심 개념

| 용어 | 설명 |
|------|------|
| **Element** | JSON UI의 기본 구성 요소 |
| **Namespace** | UI 파일의 고유 식별자 |
| **Screen** | 게임이 직접 호출하는 루트 화면 |
| **Control** | UI 요소 (Element의 다른 이름) |
| **Factory** | 동적으로 요소를 생성하는 생성기 |
| **Binding** | 하드코딩된 값을 요소에 연결 |
| **Variable** | `$`로 시작하는 사용자 정의 데이터 |
| **Property Bag** | 데이터 관련 속성 컨테이너 |
| **Modification** | 기존 요소를 수정하는 방법 |
| **Anchor** | 요소의 위치 기준점 |
| **Layer** | 렌더링 순서 (Z-Index) |
| **Easing** | 애니메이션 가속도 함수 |

### 14.2 접두사

| 접두사 | 의미 | 예시 |
|--------|------|------|
| `$` | 변수 | `$my_variable` |
| `#` | 바인딩 | `#visible`, `#text` |
| `@` | 참조 | `@namespace.element` |
| `%` | 퍼센트 크기 | `"50%"`, `"100%c"` |

### 14.3 주요 바인딩

| 바인딩 | 타입 | 설명 |
|--------|------|------|
| `#visible` | boolean | 표시 여부 |
| `#enabled` | boolean | 활성화 여부 |
| `#text` | string | 텍스트 내용 |
| `#texture` | string | 텍스처 경로 |
| `#toggle_state` | boolean | 토글 상태 |
| `#slider_value` | number | 슬라이더 값 |
| `#title_text` | string | 폼 타이틀 |
| `#hud_title_text_string` | string | HUD 타이틀 |
| `#collection_length` | int | 컬렉션 길이 |
| `#clip_ratio` | float | 클리핑 비율 |
| `#anchored_offset_value_x` | number | X 오프셋 |
| `#anchored_offset_value_y` | number | Y 오프셋 |
| `#size_binding_x` | number | X 크기 |
| `#size_binding_y` | number | Y 크기 |

### 14.4 전역 변수

| 변수 | 설명 |
|------|------|
| `$game_pad` | 컨트롤러 연결 여부 |
| `$mouse` | 마우스 연결 여부 |
| `$touch` | 터치 입력 가능 |
| `$desktop_screen` | 데스크톱 UI 선택 |
| `$pocket_screen` | 포켓 UI 선택 |
| `$education_edition` | 교육용 에디션 |
| `$is_pregame` | 게임 밖 화면 |
| `$trial` | 체험판 |
| `$is_console` | 콘솔 플랫폼 |
| `$is_holographic` | VR 모드 |
| `$can_quit` | 종료 가능 |
| `$pre_release` | 베타/프리뷰 |

### 14.5 하드코딩된 팩토리

| 팩토리 이름 | 용도 |
|-------------|------|
| `server_form_factory` | 서버 폼 |
| `hud_actionbar_text_factory` | 액션바 텍스트 |
| `hud_title_text_factory` | 타이틀 텍스트 |
| `inventory_item_factory` | 인벤토리 아이템 |

### 14.6 커스텀 렌더러

| 렌더러 | 설명 |
|--------|------|
| `inventory_item_renderer` | 아이템 아이콘 |
| `live_player_renderer` | 플레이어 모델 |
| `hud_player_renderer` | HUD 플레이어 모델 |
| `paper_doll_renderer` | 스킨 모델 |
| `heart_renderer` | 체력바 |
| `hunger_renderer` | 배고픔바 |
| `armor_renderer` | 방어구바 |
| `horse_heart_renderer` | 말 체력바 |
| `horse_jump_renderer` | 말 점프바 |
| `bubbles_renderer` | 산소 방울 |
| `mob_effects_renderer` | 상태 효과 |
| `hotbar_renderer` | 핫바 |
| `hotbar_cooldown_renderer` | 아이템 쿨다운 |
| `cursor_renderer` | 크로스헤어 |
| `hover_text_renderer` | 툴팁 |
| `gradient_renderer` | 그라데이션 |
| `progress_bar_renderer` | 진행바 |
| `banner_pattern_renderer` | 배너 패턴 |
| `enchanting_book_renderer` | 마법 부여대 책 |
| `vignette_renderer` | 비네팅 효과 |
| `credits_renderer` | 크레딧 |
| `debug_screen_renderer` | 디버그 화면 |

---

## 15. 고급 기술

### 15.1 동적 진행바

```json
{
    "animated_progress_bar": {
        "type": "panel",
        "size": [100, 10],
        "$multiplier": 0.05,
        "$data_source": "preserved_title",
        "$progress_binding": "#progress",

        "controls": [
            {
                "bar_bg": {
                    "type": "image",
                    "texture": "textures/ui/bar_bg",
                    "size": ["100%", "100%"]
                }
            },
            {
                "bar_fill": {
                    "type": "image",
                    "texture": "textures/ui/bar_fill",
                    "size": ["0%", "100%"],
                    "layer": 1,
                    "bindings": [
                        {
                            "binding_type": "view",
                            "source_control_name": "$data_source",
                            "source_property_name": "($progress_binding * $multiplier)",
                            "target_property_name": "#size_binding_x"
                        }
                    ]
                }
            }
        ]
    }
}
```

### 15.2 Title 데이터 보존

```json
{
    "preserved_title": {
        "type": "panel",
        "size": [0, 0],
        "$update_string": "data:",
        "bindings": [
            {
                "binding_name": "#hud_title_text_string"
            },
            {
                "binding_name": "#hud_title_text_string",
                "binding_name_override": "#preserved_text",
                "binding_condition": "visibility_changed"
            },
            {
                "binding_type": "view",
                "source_property_name": "(not (#hud_title_text_string = #preserved_text) and not ((#hud_title_text_string - $update_string) = #hud_title_text_string))",
                "target_property_name": "#visible"
            },
            {
                "binding_type": "view",
                "source_property_name": "((#preserved_text - $update_string) + 0)",
                "target_property_name": "#value"
            }
        ]
    }
}
```

사용법:
```javascript
// 게임 내에서
player.runCommand('title @s title data:50');
// #value = 50
```

### 15.3 스크롤 뷰

```json
{
    "scroll_panel": {
        "type": "scroll_view",
        "size": [200, 150],
        "scroll_speed": 10,
        "scrollbar_track_button": "button.menu_select",
        "scrollbar_touch_button": "button.menu_select",
        "jump_to_bottom_on_update": false,

        "scrollbar_box": "scrollbar_thumb",
        "scrollbar_track": "scrollbar_track_panel",
        "scroll_view_port": "viewport_panel",
        "scroll_content": "content_panel",

        "controls": [
            {
                "viewport_panel": {
                    "type": "panel",
                    "size": ["100%", "100%"],
                    "clips_children": true,
                    "controls": [
                        {
                            "content_panel": {
                                "type": "stack_panel",
                                "orientation": "vertical",
                                "size": ["100%", "100%c"],
                                "controls": [
                                    // 스크롤할 내용
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "scrollbar_track_panel": {
                    "type": "panel",
                    "size": [10, "100%"],
                    "anchor_from": "top_right",
                    "anchor_to": "top_right"
                }
            },
            {
                "scrollbar_thumb": {
                    "type": "panel",
                    "size": [10, 30]
                }
            }
        ]
    }
}
```

### 15.4 컬렉션 패널

```json
{
    "item_template": {
        "type": "panel",
        "size": [32, 32],
        "controls": [
            {
                "item_icon": {
                    "type": "custom",
                    "renderer": "inventory_item_renderer",
                    "size": [16, 16]
                }
            }
        ]
    },

    "item_collection": {
        "type": "collection_panel",
        "size": ["100%", "100%c"],
        "collection_name": "inventory_items",
        "factory": {
            "name": "inventory_item_factory",
            "control_name": "@namespace.item_template"
        }
    }
}
```

### 15.5 그리드 레이아웃

```json
{
    "inventory_grid": {
        "type": "grid",
        "size": [162, 54],
        "grid_dimensions": [9, 3],
        "maximum_grid_items": 27,
        "grid_item_template": "container_items",
        "collection_name": "container_items",
        "grid_fill_direction": "horizontal"
    }
}
```

### 15.6 Focus 네비게이션

```json
{
    "button_1": {
        "type": "button",
        "focus_identifier": "btn_1",
        "focus_change_right": "btn_2",
        "focus_change_down": "btn_3"
    },

    "button_2": {
        "type": "button",
        "focus_identifier": "btn_2",
        "focus_change_left": "btn_1",
        "focus_change_down": "btn_4"
    },

    "button_3": {
        "type": "button",
        "focus_identifier": "btn_3",
        "focus_change_up": "btn_1",
        "focus_change_right": "btn_4"
    },

    "button_4": {
        "type": "button",
        "focus_identifier": "btn_4",
        "focus_change_left": "btn_3",
        "focus_change_up": "btn_2"
    }
}
```

### 15.7 Dropdown

```json
{
    "my_dropdown": {
        "type": "dropdown",
        "size": [150, 20],
        "dropdown_name": "options_dropdown",
        "dropdown_content_control": "dropdown_content",
        "dropdown_area": "dropdown_area_panel",

        "controls": [
            {
                "dropdown_content": {
                    "type": "panel",
                    "size": ["100%", 20]
                }
            },
            {
                "dropdown_area_panel": {
                    "type": "panel",
                    "size": ["100%", 100]
                }
            }
        ]
    }
}
```

---

## 마무리

이 문서는 마인크래프트 베드락 에디션의 JSON UI에 대한 포괄적인 가이드입니다.

### 주요 포인트

1. **JSON UI는 Ore UI로 대체 예정** - 향후 몇 년 내에 작동하지 않을 수 있습니다
2. **필요한 것만 수정** - 전체 파일을 복사하지 말고 변경할 부분만 수정
3. **수정 전략 사용** - `modifications`를 활용하여 호환성 극대화
4. **성능 최적화** - 연산자, 바인딩, 요소 수를 최소화
5. **커스텀 네임스페이스** - 충돌 방지를 위해 고유 네임스페이스 사용

### 추가 리소스

- 베드락 위키: https://wiki.bedrock.dev
- JSON UI 스키마: Bugrock-JSON-UI-Schemas
- 커뮤니티 디스코드: Bedrock OSS

---

**작성일:** 2025년
**버전:** 종합 완벽 가이드 v1.0
**대상:** 마인크래프트 베드락 에디션 리소스 팩 개발자